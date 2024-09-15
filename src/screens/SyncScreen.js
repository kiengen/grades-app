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
			
			/** for(let i = 0; i <= tempGradebook.reportingPeriod.current.index; i++) {
				const gradebook = await client.gradebook(i);
				
				let tempGrades = {};
				
				gradebook.courses.forEach((course) => {
					assignmentList = [];
					let tempData = {};
					
					earnedSum = 0;
					totalSum = 0;
					
					// iterates through the assignments
					course.marks[0].assignments.forEach((eachAssignment) => {
						let tempAssignment = {};
					
						// sets whether or not it's summative
						tempAssignment['summative'] = (!(eachAssignment.type.toLowerCase().includes("summative") || eachAssignment.notes.toLowerCase().includes("exempt") || eachAssignment.notes.toLowerCase().includes("absent")));
						tempAssignment["name"] = eachAssignment.name;
					
						// assigns points to an array where the first number is the amount earned and the second is the total maximum number (also adds to the sums in order to calculate the percent)
						tempAssignment["points"] = [parseFloat(eachAssignment.points.split(" ")[0]), parseFloat(eachAssignment.points.split(" ")[2])];
						assignmentList.push(tempAssignment);
						
						earnedSum += parseFloat(eachAssignment.points.split(" ")[0]);
						totalSum += parseFloat(eachAssignment.points.split(" ")[2]);
					});
					
					// assigns name (if it's not already supposed to be overwritten) to both & points/grade for classList
					// this is the QUARTER'S information
					tempGrades[courseNameOverrides[course.title] ?? course.title] = {assignments: assignmentList, sums: [earnedSum, totalSum]};
					
					let index = classes.findIndex(e => e.title === (courseNameOverrides[course.title] ?? course.title));
					if(index === -1) {
						let arr = [];
						arr[i] = tempGrades;
						addClass((courseNameOverrides[course.title] ?? course.title.split(" (")[0]), "Auto-Sync", arr, Math.round(100*earnedSum/totalSum));
					}
					else {
						editClass(classes[index].id, "assignments", [...classes[index].assignments, [i] = tempGrades]);
						editClass(classes[index].id, "grade", classes[index].grade+Math.round(100*earnedSum/totalSum));
					}
				});
				// divides grade by the total number of quarters
				classes.forEach(e => editClass(e.id, "grade", e.grade/(i+1)));
			} **/
			
			// I NEED TO DO MORE PLANNING
			// How do I want it to be formatted? (Classes)
			
			// An object that has: {assignments, display, id}
			// I think that's it tbh
			// display should be: {title, section, sums}
			// assignments should have: {title, score, summative}
			
			// as far as the FOR LOOP goes I need to remember that some classes change halfway through the year, so the goal is to add a class then edit it and add the next quarter's assignments.
			
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
