import React, { useState, useEffect, useContext } from "react"; 
import { Text, StyleSheet, View, FlatList, SectionList, TouchableOpacity, TextInput, } from "react-native"; 
import { useFonts } from 'expo-font'; 
import { Feather } from "@expo/vector-icons"; 
import StudentVue from "studentvue";
import SettingList from "../context/Settings.js";
import 'react-native-url-polyfill/auto';
import ClassList from "../context/Classes.js";

 
const SyncScreen = ({ navigation, props }) => {
	const { changeSetting } = useContext(SettingList);
	const { classes, addClass, editClass, deleteClass } = useContext(ClassList);
	const [ errMessage, setErrMessage ] = useState();
	const [text, setText] = useState({});
	
    const courseNameOverrides = {'French V H (345000)': 'French', "AP Eng Language &amp; Comp (160100)": "English", "AP Psychology (787100)":"Psychology", "US &amp; VA History A (750300)":"History"};

	const [loaded] = useFonts({ 
        Graduate: require('../../assets/fonts/Graduate/Graduate-Regular.ttf'),
        Oswald: require('../../assets/fonts/Oswald/static/Oswald-SemiBold.ttf'),
        Karla: require('../../assets/fonts/Karla/static/Karla-Regular.ttf'),
        NotoSans: require('../../assets/fonts/Noto_Sans_TC/NotoSansTC-Regular.otf'),
    });
    
    if (!loaded) { 
        return null; 
    }

    const getStudentVue = async () => {
        try {
            const client = await StudentVue.login("https://portal.lcps.org/", {
				username: text.username,
                password: text.password,
            });
            let allTempGrades = [];
            let allTempClasses = [];
            
            // figures out how many periods there has already been
            const tempGradebook = await client.gradebook();
			changeSetting("quarter", tempGradebook.reportingPeriod.current.index);
			changeSetting("maxQuarter", tempGradebook.reportingPeriod.current.index);
			
			// iterates through the quarters
			for(let i = 0; i < tempGradebook.reportingPeriod.current.index; i++) {
				const gradebook = await client.gradebook(i);
				
				// each class in the quarter
				gradebook.courses.forEach((course) => {
					
					let assignmentList = [];
					
					// each assignment in the class (for that quarter)
					course.marks[0].assignments.forEach((assignment) => {
						assignmentList.append({title: assignment.name, score: {}})
					})
				})
			}
			navigation.navigate("Classes");
        } catch (err) { 
            console.log(err);
            setErrMessage(err.message);
        }
    };

 
    return (
        <View style={styles.container}>
            <View style={{backgroundColor: "#81949E"}}>
				<Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.headerText}>StudentVUE</Text>
            </View>
            <View style={styles.subheaderBox}>
				<Text style={styles.subheaderText}>INSERT DATA BELOW</Text>
            </View>
            <Text style={errMessage ? styles.errorText : {}}>{errMessage ?? ""}</Text>
            <View>
                <TextInput style={styles.input} placeholder="username" textContentType="username" onChangeText={newText => setText({...text, username: newText})} keyboardAppearance="dark"/>
                <TextInput style={styles.input} placeholder="password" textContentType="password" onChangeText={newText => setText({...text, password: newText})} keyboardAppearance="light" secureTextEntry={true}/>
            </View>
            <View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", height: 80}}>
				<TouchableOpacity onPress={() => {navigation.goBack()}}><Feather name="arrow-left" style={styles.icon}/></TouchableOpacity>
				<TouchableOpacity onPress={getStudentVue}><Text style={styles.iconText}>connect</Text></TouchableOpacity>
			</View>
        </View>
    ); 
}; 

 
const styles = StyleSheet.create({ 
    container: { 
        backgroundColor: "#467599",
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
        textShadowColor: "rgba(0,0,0,0.5)",
        paddingHorizontal: 20,
    }, 
    subheaderBox: { 
        backgroundColor: "#87bcde", 
        justifyContent: "space-evenly", 
        alignItems: "center",
        height: 40,
        flexDirection: "row",
    }, 
    subheaderText: { 
        fontSize: 20, 
        fontFamily: "Oswald", 
        textAlign: "center", 
        letterSpacing: 4,
        color: "#467599",
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
        fontFamily: "Oswald", 
    }, 
    icon: { 
        fontSize: 26, 
        alignSelf: "center", 
        color: "white",
        fontFamily: 'NotoSans',
        padding: 10,
    }, 
    iconText: {
		color: "white",
		fontSize: 15,
		fontFamily: "NotoSans",
		padding: 10,
	},
    sectionBox: { 
        height: 60, 
        backgroundColor: "#87bcde", 
        justifyContent: "center", 
        alignItems: 'center', 
    }, 
    sectionTitle: { 
        color: "#2A3D45", 
    }, 
    assignmentsBox: { 
        height: 30, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#467599", 
    },
    errorText: {
		fontSize: 15,
		fontFamily: "NotoSans",
		color: "red",
		padding: 10,
		backgroundColor: "yellow",
		borderColor: "orange",
		borderWidth: 2,
	},
    input: {
		borderWidth: 1,
		marginHorizontal: 12,
		marginTop: 24,
		padding: 10,
		height: 40,
		backgroundColor: "white",
	},
}); 

export default SyncScreen;
