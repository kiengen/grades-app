import React, { useState, useEffect, useContext } from "react"; 
import { Text, StyleSheet, View, FlatList, SectionList, TouchableOpacity, TextInput, Modal, } from "react-native"; 
import { useFonts } from 'expo-font'; 
import { Feather } from "@expo/vector-icons"; 
import StudentVue from "studentvue";
import 'react-native-url-polyfill/auto';
import ClassList from '../context/Classes.js';

const AddClassScreen = ({ navigation, props }) => { 
	const {classes, addClass, editClass, deleteClass} = useContext(ClassList);
	
	const [tempGrades, setTempGrades] = useState(null);
	const [tempClasses, setTempClasses] = useState(null);
	
	const [text, setText] = useState({className: ""});
	const [errMssg, setErrMssg] = useState(undefined);
	
    const [loaded] = useFonts({ 
        Graduate: require('../../assets/fonts/Graduate/Graduate-Regular.ttf'),
        Oswald: require('../../assets/fonts/Oswald/static/Oswald-SemiBold.ttf'),
        Karla: require('../../assets/fonts/Karla/static/Karla-Regular.ttf'),
        NotoSans: require('../../assets/fonts/Noto_Sans_TC/NotoSansTC-Regular.otf'),
    });
    
    useEffect(() => {
		setTempGrades(navigation.getParam('grades') ?? []);
		setTempClasses(navigation.getParam('classes') ?? []);
	}, []);
	
	if (!loaded) { 
        return null; 
    }
    
	const attemptToAddClass = () => {
		if(text.className === undefined) {
			setErrMssg("Class must be given a name.");
		}
		else if(text.className.length < 2) {
			setErrMssg("Class name too short!");
		}
		else if(text.section === undefined) {
			setErrMssg('Section name will default to "Classes". Tap again to confirm or change the section name.');
			text.section = "Classes";
		}
		else if(tempGrades[text.className] !== undefined) {
			setErrMssg("Class already exists");
		}
		else {
			addClass(text.className, text.section);
			//navigation.goBack();
			navigation.navigate("Classes");
		}
	};
 
    return (
        <View style={styles.container}>
			<View style={{backgroundColor: "#81949E"}}>
				<Text numberOfLines={1} adjustsFontSizeToFit={true} style={styles.headerText}>Add Class</Text>
            </View>
            <View style={styles.subheaderBox}>
                <Text style={styles.subheaderText}>INSERT DATA BELOW</Text>
            </View>
            <View>
				<Text style={errMssg !== undefined ? styles.errorText : {}}>{errMssg ?? ""}</Text>
				<TextInput style={styles.input} placeholder='class section (e.g. "A-Days")' textContentType="none" onChangeText={newText => setText({...text, section: newText})} keyboardAppearance="dark"/>
                <TextInput style={styles.input} placeholder="class name" textContentType="none" onChangeText={newText => setText({...text, className: newText})} keyboardAppearance="dark"/>
			</View>
			<View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", height: 80}}>
				<TouchableOpacity onPress={() => {navigation.goBack()}}><Feather name="arrow-left" style={styles.icon}/></TouchableOpacity>
				<TouchableOpacity onPress={() => {attemptToAddClass()}}><Text style={styles.iconText}>add class</Text></TouchableOpacity>
			</View>
			<TouchableOpacity onPress={() => {navigation.navigate("Sync")}}><Text style={styles.noiceText}>Sync to StudentVUE instead...</Text></TouchableOpacity>
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
    input: {
		borderWidth: 1,
		marginHorizontal: 12,
		marginTop: 24,
		padding: 10,
		height: 40,
		backgroundColor: "white",
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
	noiceText: {
		fontSize: 15,
		fontFamily: "NotoSans",
		color: "rgba(0,0,0,0.4)",
		padding: 10,
		marginHorizontal: 15,
		marginTop: 15,
		backgroundColor: "#bdc667",
		width: 260,
	},
}); 

export default AddClassScreen;
