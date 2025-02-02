import React, { useEffect, useState, useContext } from "react"; 
import { Text, StyleSheet, View, FlatList, SectionList, TouchableOpacity, TextInput, Modal } from "react-native"; 
import { useFonts } from 'expo-font'; 
import { Feather } from "@expo/vector-icons"; 
import SettingList from "../context/Settings.js";

const SettingsScreen = ({ navigation }) => { 
	const { settings, changeSetting, setSettings } = useContext(SettingList);
	
	const [ tempSettings, setTempSettings ] = useState(settings);
	const [ showDetail, setShowDetail ] = useState(null);
	
	const [modalVisible, setModalVisible] = useState(false);
	
    const [loaded] = useFonts({ 
        Graduate: require('../../assets/fonts/Graduate/Graduate-Regular.ttf'),
        Oswald: require('../../assets/fonts/Oswald/static/Oswald-Regular.ttf'),
        NotoSans: require('../../assets/fonts/Noto_Sans_TC/NotoSansTC-Light.otf'),
        OpenSans: require('../../assets/fonts/Open_Sans/static/OpenSans/OpenSans-Medium.ttf'),
    });
    
    const settingDisplay = [
		{title: 'school', data:
			[{setting: "quarter", title: 'default section', type: 'num-input', detail: "These grades appear first when the assignments page is opened. For instance, in a school with a semester calendar, the value 2 will set it to the second semester."},
			{setting: "maxQuarter", title: "max section", type: "num-input", detail: "The assignments page will not cycle through the gradebook beyond this value."},
			{title: "classes", type: "to-page"},
			]},
		{title: 'customization', data:
			[{title: 'gradient', type: 'checkbox', detail: 'Gives assignments and classes in their lists a dynamic color based on the grade received on the assignment'},
			{setting: "goodThreshold", title: 'good threshold', type: 'num-input', detail: 'When your grade percentage is at this level, it will be the "good color" set in the color settings below. Advice will be given as to how to obtain this grade.'},
			{setting: "warningThreshold", title: 'warning threshold', type: 'num-input', detail: 'When your grade percentage is at this level, it will be the "warning color" set in the color settings below.'},
			{setting: "badThreshold", title: 'bad threshold', type: 'num-input', detail: 'When your grade percentage is at this level, it will be the "bad color" set in the color settings below.'},
			{title: 'colors', type: 'to-page'},
			{setting: 'darkMode', title: 'dark mode', type: 'checkbox'},
			]},
		{title: 'display', data:
			[{setting: "formatives", title: 'enable formatives', type: 'checkbox', detail: 'Allows formative grades to appear under the assignments page.'},
			{setting: "summatives", title: "enable summatives", detail: 'Allows summative grades to appear under the assignments page.', type: 'checkbox'},
			{setting: "ungraded", title: 'display ungraded assignments', type: 'checkbox', detail: 'Allows assignments that are not currently graded to appear in assignments page.'},
			{setting: "discreetMode", title: 'discreet mode', type: 'checkbox', detail: 'Hides assignments that score below the warning threshold, as well as removing concrete numbers off the main screens.'},
    ]}];
     
    if (!loaded) { 
        return null; 
    }
    
	return (
		<SectionList
			bounces={false}
			backgroundColor="#87bcde"
			showsVerticalScrollIndicator={false}
			decelerationRate={0.97}
			indicatorStyle="white"
			stickySectionHeadersEnabled={false}
			sections={settingDisplay}
			data={settingDisplay}
			extraData={tempSettings}
			renderItem={({ item }) => {
				return (
					<View>
						<View style={styles.settingRow}>
							<View style={{flex: 1, flexDirection: "row", alignItems: 'center'}}><Text style={styles.settingText}>{item.title} </Text>
								{item.detail ? <TouchableOpacity onPress={() => {setShowDetail(showDetail == item.title ? null : item.title)}}><Feather style={styles.settingIcon} name='help-circle'/></TouchableOpacity> : <></>}
								{item.type == 'to-page' ? <TouchableOpacity><Feather style={styles.settingIcon} name='arrow-right'/></TouchableOpacity> : <></>}
								{item.type == 'checkbox' ? <TouchableOpacity activeOpacity={0.6} onPressOut={() => setTempSettings({...tempSettings, [item.setting ?? item.title]: !tempSettings[item.setting ?? item.title]})}><Feather style={styles.settingIcon} name={tempSettings[item.setting ?? item.title] == false ? "square" : "check-square"}/></TouchableOpacity> : <></>}
							</View>
							
							{item.type == 'num-input' ? <View style={{flex: 0.6}}><TextInput value={`${tempSettings[item.setting ?? item.title]}`} onChangeText={(text) => {setTempSettings({...tempSettings, [item.setting ?? item.title]: text})}} maxLength={6} keyboardAppearance={tempSettings.darkMode ? "dark" : "light"} inputMode='decimal' style={styles.numInput}></TextInput></View> : <></>}
							
						</View>
						{showDetail == item.title ? <Text style={styles.text}>{item.detail}</Text> : <></>}
					</View>
				);
			}}
			renderSectionHeader={({section: {title}}) => (
				<View style={{height: 60}}>
					<View style={styles.sectionBox}>
						<Text style={styles.sectionTitle}>{title}</Text>
					</View>
				</View>
			)}
			renderSectionFooter={() => (<View style={{height: 15,}}/>)}
			ListHeaderComponent={
				<View style={{backgroundColor: "#81949E"}}>
					<Text style={styles.headerText}>SETTINGS</Text>
				</View>
				
			}
			ListFooterComponent={
				<View style={styles.sectionBox}>
					<TouchableOpacity onPress={() => {navigation.goBack()}}><Feather name="arrow-left" style={styles.icon}/></TouchableOpacity>
					<TouchableOpacity disabled={tempSettings.toString()==settings.toString()} onPress={() => {setSettings(tempSettings); navigation.goBack()}}><Feather name="save" style={tempSettings.toString() === settings.toString() ? {...styles.icon, opacity: 0.4} : styles.icon}/></TouchableOpacity>
					<TouchableOpacity onPress={() => {setSettings(tempSettings)}}><Feather name="refresh-cw" style={styles.icon}/></TouchableOpacity>
				</View>
			}
			contentContainerStyle={{flexGrow: 1,}}
		/>
	);
}; 

 
const styles = StyleSheet.create({ 
    container: { 
        alignItems: "center",
        flex: 1,
    }, 
    headerText: { 
        fontSize: 70, 
        color: "#2A3D45", 
        marginVertical: 30, 
        alignSelf: "center", 
        fontFamily: "Graduate", 
        textShadowRadius: 6, 
        textShadowOffset: {width: 0, height: 2}, 
        textShadowColor: "rgba(0,0,0,0.5)" 
    }, 
    settingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 35,
		paddingHorizontal: 15,
	},
	settingText: {
		fontSize: 16,
		fontFamily: 'NotoSans',
		color: "#2A3D45",
	},
	settingIcon: {
		fontSize: 16,
		color: '#2a3d45',
		padding: 7,
	},
    sectionBox: { 
        height: 50, 
        backgroundColor: "#467599", 
        justifyContent: "center", 
        alignItems: 'center',
        flexDirection: "row",
    }, 
    sectionTitle: { 
        color: "white", 
        fontFamily: "Oswald",
        fontSize: 22,
        textTransform: "uppercase",
    },
    numInput: {
		backgroundColor: 'white',
		width: 60,
		height: 25,
		borderWidth: 1.5,
		borderColor: "#467599",
		padding: 3,
	},
    text: {
		fontSize: 15,
		fontFamily: "OpenSans",
		color: "rgb(0,0,0)",
		backgroundColor: "rgba(0,0,0,0.2)",
		padding: 9,
		margin: 8,
	},
	smallButtonText: {
		fontSize: 20,
		fontFamily: "NotoSans",
		color: "white",
		backgroundColor: "#bdc667",
		padding: 8,
		borderWidth: 4,
		borderColor: "rgba(255,255,255,0.45)",
		//borderRadius: 10,
		//overflow: 'hidden',
	},
	icon: { 
        fontSize: 23,
        color: "white",
        fontFamily: "Graduate",
        marginHorizontal: 30,
    },
}); 
 

export default SettingsScreen; 
