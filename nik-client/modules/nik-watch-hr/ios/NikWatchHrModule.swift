import ExpoModulesCore
import WatchConnectivity
import HealthKit

public class NikWatchHrModule: Module {
  private var heartRateObserver: Any?
  private var statusObserver: Any?

  public func definition() -> ModuleDefinition {
    Name("NikWatchHr")

    Events("onHeartRate", "onStatus")

    OnCreate {
      NikWatchHrSession.shared.activate()
      NikWatchHrSession.shared.onHeartRate = { [weak self] bpm in
        self?.sendEvent("onHeartRate", ["bpm": bpm])
      }
      NikWatchHrSession.shared.onStatus = { [weak self] message in
        self?.sendEvent("onStatus", ["message": message])
      }
    }

    Function("isAvailable") { () -> Bool in
      NikWatchHrSession.shared.isAvailable()
    }

    AsyncFunction("getConnectionState") { () -> [String: Any] in
      NikWatchHrSession.shared.connectionSnapshot()
    }

    AsyncFunction("requestAuthorization") { (promise: Promise) in
      NikWatchHrSession.shared.requestHealthAuthorization { success in
        promise.resolve(success)
      }
    }

    AsyncFunction("connect") { () -> [String: Any] in
      NikWatchHrSession.shared.activate()
      NikWatchHrSession.shared.pingWatch(command: "start")
      return NikWatchHrSession.shared.connectionSnapshot()
    }

    AsyncFunction("getLatestHeartRate") { () -> Double? in
      let bpm = NikWatchHrSession.shared.latestBpm
      return bpm > 0 ? bpm : nil
    }

    AsyncFunction("pingWatch") { (command: String?) in
      NikWatchHrSession.shared.pingWatch(command: command ?? "start")
    }
  }
}
