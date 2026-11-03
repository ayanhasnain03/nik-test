import Foundation
import WatchConnectivity

final class IOSConnector: NSObject, ObservableObject, WCSessionDelegate {
  var session: WCSession

  init(session: WCSession = .default) {
    self.session = session
    super.init()
    session.delegate = self
    session.activate()
  }

  func session(
    _ session: WCSession,
    activationDidCompleteWith activationState: WCSessionActivationState,
    error: Error?
  ) {
    sendMessage(["msg": "Watch app ready", "state": activationState.rawValue])
  }

  func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
    if let command = message["counter"] as? String {
      NotificationCenter.default.post(
        name: Notification.Name("NikWatchCommand"),
        object: nil,
        userInfo: ["command": command]
      )
    }
  }

  func sendHeartRate(_ bpm: Double) {
    sendMessage([
      "bpm": bpm,
      "msg": "Heart rate: \(bpm)",
    ])
  }

  func sendString(text: String) {
    sendMessage(["msg": text])
  }

  private func sendMessage(_ payload: [String: Any]) {
    if session.isReachable {
      session.sendMessage(payload, replyHandler: nil) { _ in
        self.session.transferUserInfo(payload)
      }
    } else {
      session.transferUserInfo(payload)
    }
  }
}
