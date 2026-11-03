import { Tabs } from 'expo-router';
import { Text } from 'react-native';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text className={`font-sans-medium text-[11px] ${focused ? 'text-teal' : 'text-slate-soft'}`}>
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'rgba(16,33,29,0.08)',
          height: 64,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => <TabLabel label="Home" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <Text className={focused ? 'text-teal' : 'text-slate-soft'}>●</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="investigations"
        options={{
          title: 'Explore',
          tabBarLabel: ({ focused }) => <TabLabel label="Explore" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <Text className={focused ? 'text-teal' : 'text-slate-soft'}>◇</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarLabel: ({ focused }) => <TabLabel label="History" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <Text className={focused ? 'text-teal' : 'text-slate-soft'}>▣</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="journals"
        options={{
          title: 'Journal',
          tabBarLabel: ({ focused }) => <TabLabel label="Journal" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <Text className={focused ? 'text-teal' : 'text-slate-soft'}>✎</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: ({ focused }) => <TabLabel label="Settings" focused={focused} />,
          tabBarIcon: ({ focused }) => (
            <Text className={focused ? 'text-teal' : 'text-slate-soft'}>◎</Text>
          ),
        }}
      />
    </Tabs>
  );
}
