import SwiftUI

@main
struct NIKWatchAppApp: App {
  @StateObject private var workoutManager = WorkoutManager()

  var body: some Scene {
    WindowGroup {
      ContentView()
        .environmentObject(workoutManager)
    }
  }
}
