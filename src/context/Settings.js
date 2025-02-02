import React, { useReducer, useContext } from 'react';

const Settings = React.createContext();

export const SettingList = ({ children }) => {
	const defaults = {
		gradient: true,
		goodThreshold: 1,
		warningThreshold: 0.85,
		badThreshold: 0.7,
		headerColor: '#81949e',
		titleColor: '#2a3d45',
		backgroundColor: '#467599',
		subheaderColor: '#87bcde',
		accentColor: '#bdc667',
		goodColor: [189, 198, 103],
		warningColor: [255, 214, 102],
		badColor: [230, 125, 115],
		
		darkMode: false,
		discreetMode: false,
		
		quarter: 1,
		maxQuarter: 1,
		
		formatives: false,
		summatives: true,
		ungraded: false,
		
		classes: [],
	};
	
	const listReducer = (state, action) => {
		switch (action.type) {
			case 'changeSetting':
				state[action.payload.name] = action.payload.newValue;
				return state;
			case 'reset':
				return { defaults };
			case 'totalRewrite':
				return action.payload;
			default:
				console.log("no action passed to Settings");
				return state;
		}
	};
	
	const [settings, dispatch] = useReducer(listReducer, defaults);
	
	const changeSetting = ( setting, newValue ) => {
		dispatch({type: "changeSetting", payload: {setting, newValue}});
	};
	const setSettings = ( settings ) => {
		dispatch({type: "totalRewrite", payload: settings});
	};
	
	return <Settings.Provider value={{settings, changeSetting, setSettings}}>{children}</Settings.Provider>;
};

export default Settings;
