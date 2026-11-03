import Foundation
import WatchConnectivity
import HealthKit

final class NikWatchHrSession: NSObject, WCSessionDelegate {
  static let shared = NikWatchHrSession()

  private(set) var latestBpm: Double = 0
  private(set) var lastMessage: String = ""
  private(set) var isActivated = false

  var onHeartRate: ((Double) -> Void)?
  var onStatus: ((String) -> Void)?

  private override init() {
    super.init()
  }

  func activate() {
    guard WCSession.isSupported() else {
      onStatus?("WatchConnectivity is not supported on this device.")
      return
    }
    let session = WCSession.default
    session.delegate = self
    if session.activationState != .activated {
      session.activate()
    } else {
      isActivated = true
      emitReachability()
    }
  }

  func isAvailable() -> Bool {
    WCSession.isSupported()
  }

  func connectionSnapshot() -> [String: Any] {
    guard WCSession.isSupported() else {
      return [
        "supported": false,
        "paired": false,
        "reachable": false,
        "watchAppInstalled": false,
        "activated": false,
        "latestBpm": latestBpm,
      ]
    }
    let session = WCSession.default
    return [
      "supported": true,
      "paired": session.isPaired,
      "reachable": session.isReachable,
      "watchAppInstalled": session.isWatchAppInstalled,
      "activated": session.activationState == .activated,
      "latestBpm": latestBpm,
      "lastMessage": lastMessage,
    ]
  }

  func pingWatch(command: String = "start") {
    guard WCSession.isSupported() else {
      onStatus?("WatchConnectivity is not supported on this device.")
      return
    }
    let session = WCSession.default
    if !session.isPaired {
      onStatus?("Apple Watch is not paired with this iPhone.")
      return
    }
    if !session.isWatchAppInstalled {
      onStatus?("Install the NIK app on your Apple Watch, then open it.")
      return
    }
    if session.isReachable {
      session.sendMessage(["counter": command], replyHandler: nil) { error in
        self.onStatus?("Could not reach Watch: \(error.localizedDescription)")
      }
      onStatus?("Pinged Apple Watch — open NIK on the Watch and tap Start.")
    } else {
      session.transferUserInfo(["counter": command])
      onStatus?("Watch is paired but not reachable. Open the NIK Watch app, then try Connect again.")
    }
  }

  func requestHealthAuthorization(completion: @escaping (Bool) -> Void) {
    guard HKHealthStore.isHealthDataAvailable() else {
      completion(false)
      return
    }
    let store = HKHealthStore()
    let types: Set<HKObjectType> = [
      HKObjectType.quantityType(forIdentifier: .heartRate)!,
    ]
    store.requestAuthorization(toShare: [], read: types) { success, _ in
      DispatchQueue.main.async {
        completion(success)
      }
    }
  }

  func session(
    _ session: WCSession,
    activationDidCompleteWith activationState: WCSessionActivationState,
    error: Error?
  ) {
    isActivated = activationState == .activated
    if let error {
      onStatus?("Watch session error: \(error.localizedDescription)")
    } else {
      emitReachability()
    }
  }

  func sessionDidBecomeInactive(_ session: WCSession) {}

  func sessionDidDeactivate(_ session: WCSession) {
    session.activate()
  }

  func sessionReachabilityDidChange(_ session: WCSession) {
    emitReachability()
  }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    handleIncoming(message)
  }

  func session(
    _ session: WCSession,
    didReceiveMessage message: [String: Any],
    replyHandler: @escaping ([String: Any]) -> Void
  ) {
    handleIncoming(message)
    replyHandler(["ok": true])
  }

  func session(_ session: WCSession, didReceiveUserInfo userInfo: [String: Any] = [:]) {
    handleIncoming(userInfo)
  }

  private func handleIncoming(_ message: [String: Any]) {
    if let bpm = message["bpm"] as? Double {
      applyBpm(bpm)
      return
    }
    if let bpm = message["bpm"] as? Int {
      applyBpm(Double(bpm))
      return
    }
    if let bpm = message["bpm"] as? NSNumber {
      applyBpm(bpm.doubleValue)
      return
    }

    if let text = message["msg"] as? String {
      lastMessage = text
      if let bpm = Self.parseLegacyHeartRate(text) {
        applyBpm(bpm)
      } else {
        onStatus?(text)
      }
    }
  }

  private func applyBpm(_ bpm: Double) {
    guard bpm > 0 else { return }
    latestBpm = bpm
    DispatchQueue.main.async {
      self.onHeartRate?(bpm)
    }
  }

  private func emitReachability() {
    guard WCSession.isSupported() else { return }
    let session = WCSession.default
    if session.isPaired && session.isReachable {
      onStatus?("Apple Watch reachable.")
    } else if session.isPaired {
      onStatus?("Watch paired — open the NIK Watch app to stream heart rate.")
    } else {
      onStatus?("No Apple Watch paired with this iPhone.")
    }
  }

  static func parseLegacyHeartRate(_ text: String) -> Double? {
    guard text.lowercased().contains("heart rate") else { return nil }
    let parts = text.split(separator: ":")
    guard parts.count >= 2 else { return nil }
    return Double(parts[1].trimmingCharacters(in: .whitespacesAndNewlines))
  }
}
