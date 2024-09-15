import React from "react";
import { StatusBar } from 'expo-status-bar';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { SettingList } from './src/context/Settings.js';
import { ClassList } from './src/context/Classes.js';
import ClassScreen from "./src/screens/ClassScreen.js"; 
import AssignmentScreen from "./src/screens/AssignmentScreen.js"; 
import SyncScreen from "./src/screens/SyncScreen.js";
import AddClassScreen from "./src/screens/AddClassScreen.js";
import SettingsHubScreen from "./src/screens/SettingHubScreen.js";

const navigator = createStackNavigator( 
{ 
	Classes: ClassScreen, 
    Assignments: AssignmentScreen, 
    Sync: SyncScreen,
    AddClass: AddClassScreen,
    SettingsHub: SettingsHubScreen,
},
{
	defaultNavigationOptions: {
		headerStyle: {
			backgroundColor: "rgb(70, 117, 153)",
			height: 40,
		},
		headerBackVisible: false,
		gestureEnabled: false,
		// headerBackVisible wasn't working so I'll just get rid of it entirely... sad but I can't think of a workaround
		headerShown: false,
	},
}, 
{ 
    initialRouteName: "Classes",
});

const AppNavigator = createAppContainer(navigator);

export default () => {
	return (
		<SettingList>
			<ClassList>
				<AppNavigator>
				
				</AppNavigator>
			</ClassList>
		</SettingList>
	);
}

// COLOR REFERENCE
// sort of blue gray (gray)			#81949e		rgb(129, 148, 158)
// really dark blue (titles)		#2a3d45		rgb(42,  61,  69 )
// 2nd darkest blue (teal) 			#467599		rgb(70,  117, 153)
// light blue (baby blue)			#87bcde		rgb(135, 189, 222)
// class button green (chartreuse)	#bdc667		rgb(189, 198, 103)
// class button red (burnt sienna)	#e05947		rgb(224, 89,  71 )
