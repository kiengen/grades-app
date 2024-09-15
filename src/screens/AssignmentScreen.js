import React, { useState, useEffect, useContext } from "react"; 
import { Text, StyleSheet, View, FlatList, SectionList, TouchableOpacity, TouchableHighlight } from "react-native"; 
import { useFonts } from 'expo-font'; 
import { Feather } from "@expo/vector-icons";
import StudentVue from "studentvue";
import 'react-native-url-polyfill/auto';
import SettingList from '../context/Settings.js';
import ClassList from '../context/Classes.js';


const AssignmentScreen = ({ navigation, props }) => { 
	const { classes } = useContext(ClassList)
	const { settings, changeSetting } = useContext(SettingList);
	
    const [classGrades, setClassGrades] = useState(classes[settings.quarter-1]);
    const [quarter, setQuarter] = useState(settings.quarter);

 
    //const classList = [{title: 'A-Days', data: [{name: "English", grade: 0,}, {name: "French", grade: 100}, {name: "History", grade: 100}, {name: 'Psychology', grade: 80},],}, {title: 'B-Days', data: [{name: "Math", grade: 90,}, {name: "Physics", grade: 92}, {name: "Computer Science", grade: 100}, {name: 'Economics', grade: 70},],},];
    const assignments = [ [{name: "Dillard Essay", earned: 10, max: 10}, {name: "Dillard SOAPSTONES", earned: 10, max: 10}], ];

 
    const [loaded] = useFonts({ 
        Graduate: require('../../assets/fonts/Graduate/Graduate-Regular.ttf'),
        Oswald: require('../../assets/fonts/Oswald/static/Oswald-SemiBold.ttf'),
        Karla: require('../../assets/fonts/Karla/static/Karla-Regular.ttf'),
        NotoSans: require('../../assets/fonts/Noto_Sans_TC/NotoSansTC-Light.otf'),
    });
    
    useEffect(() => {
		// nuthin
		console.log(classGrades);
	}, []);
	
	if (!loaded) { 
        return null; 
    }
    
    function hexToRgb(hex) {
		let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
		
	}
    
    const assignmentRGB = (percent) => {
		let wt = settings.warningThreshold; // "warningThreshold" at this percent, will be yellow
		let gt = settings.goodThreshold; // "goodThreshold" at this percent, will be blueish-green
		let bt = settings.badThreshold; // "badThreshold" at this percent, will be red
		
		gc = settings.goodColor; // good color
		wc = settings.discreetMode ? gc : settings.warningColor; // warning color
		bc = settings.discreetMode ? gc : settings.badColor; // bad color
		
		if(percent <= wt) {
			if(percent <= bt) {
				return `rgb(${bc[0]}, ${bc[1]}, ${bc[2]})`;
			}
			return `rgb(${wc[0]+(wt-percent)/(wt-bt)*(bc[0]-wc[0])}, ${214+(wt-percent)/(wt-bt)*(bc[1]-wc[1])}, ${102+(wt-percent)/(wt-bt)*(bc[2]-wc[2])})`;
		}
		if(percent >= gt) {
			return `rgb(${gc[0]}, ${gc[1]}, ${gc[2]})`;
		}
		return `rgb(${gc[0]+(gt-percent)/(gt-wt)*(wc[0]-gc[0])}, ${gc[1]+(gt-percent)/(gt-wt)*(wc[1]-gc[1])}, ${gc[2]-(gt-percent)/(gt-wt)*(wc[2]-gc[2])})`;
	};

 
    return (
        <View style={{flex:1, backgroundColor: "#bdc667"}}>
			<div></div>
            <View style={{backgroundColor: "#81949E", justifyContent: "center", alignItems: "center", height: 140}}>
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.headerText}>{navigation.getParam('subject')}</Text>
            </View>
            <TouchableHighlight activeOpacity={0.5} underlayColor="#87bcde" style={styles.subheaderBox} onPress={() => {setQuarter((quarter+1)%(settings.maxQuarter)); setClassGrades(navigation.getParam('grades')[(quarter+1)%(settings.maxQuarter)][navigation.getParam('subject')]);}}>
                <Text style={styles.subheaderText}>QUARTER {quarter} ({Math.round(10000*classGrades["sums"][0]/classGrades["sums"][1])/100}%)</Text>
            </TouchableHighlight>
            <View style={styles.subsubheaderBox}>
				<Text style={styles.subsubheaderText}>Assignments</Text>
			</View>
            <View style={{flex:1}}>
                <FlatList
					bounces={false}
                    data={classGrades.assignments}
                    renderItem={({item}) => {
                        return (
							<TouchableOpacity style={{...styles.listBox, backgroundColor: assignmentRGB(item.points[0]/item.points[1])}} onPress={() => {}}>
								<View style={{flex:3.65}}>
									<Text numberOfLines={1} style={styles.listText}>{item.name}</Text>
								</View>
								<View style={{justifyContent: "end", flex:1}}>
									<Text style={{...styles.listText, alignSelf: "flex-end"}}>{item.points[0]}/{item.points[1]}</Text>
								</View>
							</TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={<Text style={{...styles.listText, paddingLeft: 10, paddingVertical: 5}}>No assignments yet</Text>}
                />
            </View>
            <View style={styles.footerBox}>
				<TouchableOpacity onPress={() => {navigation.goBack()}}><Feather name="arrow-left" style={styles.icon}/></TouchableOpacity>
				<Feather style={styles.icon} name="bar-chart-2"></Feather>
            </View>
        </View>
    ); 
}; 

const styles = StyleSheet.create({ 
    container: { 
        alignItems: "center", 
    }, 
    headerText: { 
        fontSize: 70, 
        color: "#2A3D45",
        alignSelf: "center", 
        fontFamily: "Graduate",
        textShadowOffset: {width: 0, height: 2}, 
        textShadowColor: "rgba(0,0,0,0.5)",
        textShadowRadius: 6,
        paddingHorizontal: 30,
    },
    subheaderBox: { 
        backgroundColor: "#87bcde", 
        justifyContent: "center", 
        height: 40, 
    }, 
    subheaderText: { 
        fontSize: 20, 
        fontFamily: "Oswald", 
        fontWeight: "bold",
        textAlign: "center", 
        letterSpacing: 4, 
        color: "#467599"
    },
    subsubheaderText: {
		color: "white",
		fontFamily: "Graduate",
	},
    icon: { 
        fontSize: 26,
        color: "white",
        fontFamily: "Graduate",
        marginHorizontal: 30,
    },
    subsubheaderBox: { 
        height: 35, 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#467599", 
    },
    footerBox: {
		backgroundColor: "#467599",
		height: 70,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
	},
	listBox: {
		justifyContent: "space-between",
		height: 29,
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		paddingHorizontal: 15,
		activeOpacity: 1,
	},
	listText: {
		fontSize: 16,
		color: "rgba(0,0,0,0.6)",
		fontFamily: "NotoSans",
	},
}); 

export default AssignmentScreen;
