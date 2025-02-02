import React, { useEffect, useState, useContext } from "react"; 
import { Text, StyleSheet, View, FlatList, SectionList, TouchableOpacity, } from "react-native"; 
import { useFonts } from 'expo-font'; 
import { Feather } from "@expo/vector-icons";
import SettingsList from "../context/Settings.js";
import ClassList from "../context/Classes.js";

const ClassScreen = ({ navigation }) => { 
	const { settings } = useContext(SettingsList);
	const { classes, addClass, editClass, deleteClass } = useContext(ClassList);
	
	const [displayClassList, setDisplayClassList] = useState([]);
	
    // test data
    // const classList = [{title: 'A-Days', data: [{name: "English", grade: 0,}, {name: "French", grade: 100}, {name: "History", grade: 100}, {name: 'Psychology', grade: 80},],}, {title: 'B-Days', data: [{name: "Math", grade: 90,}, {name: "Physics", grade: 92}, {name: "Computer Science", grade: 100}, {name: 'Economics', grade: 70},],},];

    const [loaded] = useFonts({ 
        Graduate: require('../../assets/fonts/Graduate/Graduate-Regular.ttf'),
        OswaldLight: require('../../assets/fonts/Oswald/static/Oswald-Light.ttf'),
        NotoSans: require('../../assets/fonts/Noto_Sans_TC/NotoSansTC-Bold.otf'),
    }); 
     
    if (!loaded) { 
        return null; 
    }
    
	// returns the sectionlist if it needs it
    // (nonfunctional due to Naviance API not returning sufficient data)
	/**if(displayClassList === undefined || typeof displayClassList.title != "string") {
		return (
			<SectionList
				bounces={false}
				backgroundColor="#467599"
				showsVerticalScrollIndicator={false}
				decelerationRate={0.97}
				indicatorStyle="white"
				stickySectionHeadersEnabled={false}
				sections={displayClassList ?? []}
				data={displayClassList ?? []}
				renderItem={({ item }) => {
					return (
						<View>
							<TouchableOpacity style={[styles.classButton, {backgroundColor: `rgb(${224-item.grade*0.35}, ${89+item.grade*1.09}, ${71+item.grade*0.32})`}]}
								onPress={() => {
									navigation.replace("Assignments", {...navigation.state.params, subject: item.name});
								}}>
								<Text numberOfLines={1} style={styles.buttonText}>{item.grade}% - {item.name}</Text>
							</TouchableOpacity>
						</View>
					);
				}}
				renderSectionHeader={({section: {title}}) => (
					<View style={{height: 80}}>
						<View style={styles.sectionBox}>
							<Text style={styles.sectionTitle}>{title}</Text>
						</View>
					</View>
				)}
				renderSectionFooter={() => (<View style={{height: 35,}}/>)}
				ListEmptyComponent={
					<View style={styles.container}>
						<View style={{paddingHorizontal: 17, paddingVertical: 30}}>
							<Text style={styles.text}>No classes have been added. Press button below to start adding classes!</Text>
						</View>
						<TouchableOpacity onPress={() => {navigation.navigate("AddClass")}}>
							<Text style={styles.smallButtonText}>ADD CLASS</Text>
						</TouchableOpacity>
					</View>
				}
				ListHeaderComponent={
					<View style={{backgroundColor: "#81949E"}}>
						<Text style={styles.headerText}>CLASSES</Text>
					</View>
					
				}
				ListFooterComponent={
					<View style={styles.sectionBox}>
						<TouchableOpacity onPress={() => navigation.navigate("SettingsHub")}>
							<Feather style={styles.icon} name='settings'/>
						</TouchableOpacity>
					</View>
				}
				contentContainerStyle={{flexGrow: 1,}}
			/>
		);
	} **/
	// returns a flatlist if it only has one section
	return (
		<FlatList
				bounces={false}
				backgroundColor="#467599"
				showsVerticalScrollIndicator={false}
				decelerationRate={0.97}
				indicatorStyle="white"
				stickySectionHeadersEnabled={false}
				data={classes.filter(e => e.quarter)}
				renderItem={({ item }) => {
					return (
						<View>
							<TouchableOpacity style={[styles.classButton, {backgroundColor: item.grade != NaN ? `rgb(${224-(item.grade)*0.35}, ${89+(item.grade)*1.09}, ${71+(item.grade)*0.32})` : "goldenrod"}]}
								onPress={() => {
									navigation.replace("Assignments", {subject: item.title});
								}}>
								<Text numberOfLines={1} style={styles.buttonText}>{item.grade == NaN ? "phew" : "oh no"}{item.grade == NaN ? "None" : item.grade} - {item.title}</Text>
							</TouchableOpacity>
						</View>
					);
				}}
				ListHeaderComponent={
					<View>
						<View style={{backgroundColor: "#81949E"}}>
							<Text style={styles.headerText}>CLASSES</Text>
						</View>
						<View style={{height: 80}}>
							<View style={styles.sectionBox}>
								<Text style={styles.sectionTitle}>CLASSES</Text>
							</View>
						</View>
					</View>
				}
				ListFooterComponent={
					<View>
						<View style={{height: 35}}/>
						<View style={styles.sectionBox}>
							<TouchableOpacity onPress={() => navigation.navigate("SettingsHub")}>
								<Feather style={styles.icon} name='settings'/>
							</TouchableOpacity>
						</View>
					</View>
				}
				ListEmptyComponent={
					<View style={styles.container}>
						<View style={{paddingHorizontal: 17, paddingVertical: 30}}>
							<Text style={styles.text}>No classes have been added. Press button below to start adding classes!</Text>
						</View>
						<TouchableOpacity onPress={() => {navigation.navigate("AddClass")}}>
							<Text style={styles.smallButtonText}>ADD CLASS</Text>
						</TouchableOpacity>
					</View>
				}
				contentContainerStyle={{flexGrow: 1}}
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
    classButton: { 
        borderRadius: 50, 
        //backgroundColor: '#87BCDE', 
        height: 70, 
        width: 300, 
        alignItems: "center", 
        alignSelf: "center", 
        justifyContent: "center", 
        marginVertical: 10,
    }, 
    buttonText: { 
        color: "white", 
        fontSize: 30, 
        fontFamily: "OswaldLight",
        paddingHorizontal: 20,
        textTransform: "uppercase",
    },

    icon: { 
        fontSize: 26, 
        alignSelf: "center", 
        color: "#467599" 
    }, 
    sectionBox: { 
        height: 60, 
        backgroundColor: "#87bcde", 
        justifyContent: "center", 
        alignItems: 'center', 
    }, 
    sectionTitle: { 
        color: "#467599", 
        fontFamily: "NotoSans",
        fontSize: 17,
    },
    text: {
		fontSize: 15,
		fontFamily: "NotoSans",
		color: "#467599",
		backgroundColor: "#87bcde",
		padding: 7,
		borderRadius: 6,
		overflow: 'hidden',
		paddingBottom: 9,
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
}); 
 

export default ClassScreen; 
