import Foundation
import HealthKit

final class WorkoutManager: NSObject, ObservableObject {
  var iosConnector = IOSConnector()

  let healthStore = HKHealthStore()
  var session: HKWorkoutSession?
  var builder: HKLiveWorkoutBuilder?

  @Published var running = false
  @Published var permissionGranted = false
  @Published var heartRate: Double = 0

  override init() {
    super.init()
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(handlePhoneCommand(_:)),
      name: Notification.Name("NikWatchCommand"),
      object: nil
    )
  }

  @objc private func handlePhoneCommand(_ note: Notification) {
    let command = (note.userInfo?["command"] as? String) ?? "start"
    DispatchQueue.main.async {
      if command == "start" || command == "ping" {
        if self.permissionGranted && !self.running {
          self.startWorkout()
        }
      } else if command == "stop" {
        if self.running {
          self.endWorkout()
        }
      }
    }
  }

  func startWorkout() {
    let configuration = HKWorkoutConfiguration()
    configuration.activityType = .walking
    configuration.locationType = .indoor

    do {
      session = try HKWorkoutSession(healthStore: healthStore, configuration: configuration)
      builder = session?.associatedWorkoutBuilder()
    } catch {
      iosConnector.sendString(text: "startWorkout failed")
      return
    }

    builder?.dataSource = HKLiveWorkoutDataSource(
      healthStore: healthStore,
      workoutConfiguration: configuration
    )

    session?.delegate = self
    builder?.delegate = self

    let startDate = Date()
    session?.startActivity(with: startDate)
    builder?.beginCollection(withStart: startDate) { _, _ in }
  }

  func requestAuthorization() {
    let typesToShare: Set = [
      HKQuantityType.workoutType(),
      HKQuantityType.quantityType(forIdentifier: .heartRate)!,
    ]
    let typesToRead: Set = [
      HKQuantityType.quantityType(forIdentifier: .heartRate)!,
    ]

    healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { _, _ in
      self.checkPermissionStatus()
    }
  }

  func checkPermissionStatus() {
    let status = healthStore.authorizationStatus(for: HKSampleType.workoutType())
    DispatchQueue.main.async {
      self.permissionGranted = status == .sharingAuthorized
    }
  }

  func endWorkout() {
    session?.end()
  }

  func updateForStatistics(_ statistics: HKStatistics?) {
    guard let statistics else { return }

    DispatchQueue.main.async {
      switch statistics.quantityType {
      case HKQuantityType.quantityType(forIdentifier: .heartRate):
        let unit = HKUnit.count().unitDivided(by: .minute())
        let bpm = statistics.mostRecentQuantity()?.doubleValue(for: unit) ?? 0
        self.heartRate = bpm
        if bpm > 0 {
          self.iosConnector.sendHeartRate(bpm)
        }
      default:
        break
      }
    }
  }
}

extension WorkoutManager: HKWorkoutSessionDelegate {
  func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {}

  func workoutSession(
    _ workoutSession: HKWorkoutSession,
    didChangeTo toState: HKWorkoutSessionState,
    from fromState: HKWorkoutSessionState,
    date: Date
  ) {
    DispatchQueue.main.async {
      self.running = toState == .running
    }
    if toState == .ended {
      builder?.endCollection(withEnd: date) { _, _ in
        self.builder?.finishWorkout { _, _ in }
      }
    }
  }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
  func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}

  func workoutBuilder(
    _ workoutBuilder: HKLiveWorkoutBuilder,
    didCollectDataOf collectedTypes: Set<HKSampleType>
  ) {
    for type in collectedTypes {
      guard let quantityType = type as? HKQuantityType else { return }
      updateForStatistics(workoutBuilder.statistics(for: quantityType))
    }
  }
}
