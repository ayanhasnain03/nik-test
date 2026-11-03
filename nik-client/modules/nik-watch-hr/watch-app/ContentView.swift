import SwiftUI

struct ContentView: View {
  @EnvironmentObject var workoutManager: WorkoutManager

  var body: some View {
    VStack(alignment: .center) {
      Text("NIK")

      Image(systemName: "heart.fill")
        .imageScale(.large)
        .foregroundStyle(.red)

      if workoutManager.permissionGranted {
        Text(
          "\(workoutManager.heartRate.formatted(.number.precision(.fractionLength(0)))) bpm"
        )
        .font(.system(size: 24))
        .padding(.vertical, 12)

        Button {
          if workoutManager.running {
            workoutManager.endWorkout()
          } else {
            workoutManager.startWorkout()
          }
        } label: {
          Text(workoutManager.running ? "Stop" : "Start")
            .padding()
        }
      } else {
        ScrollView {
          Text(
            """
            Health permissions are not enabled.

            On your Apple Watch, go to:
            Settings → Health → Apps → NIK

            Enable permissions, then reopen NIK.
            """
          )
          .multilineTextAlignment(.center)
          .foregroundColor(.gray)
          .padding(.horizontal)
          .font(.footnote)
        }
        .frame(maxHeight: 120)
      }
    }
    .padding()
    .onAppear {
      workoutManager.requestAuthorization()
    }
  }
}

#Preview {
  ContentView().environmentObject(WorkoutManager())
}
