import React, { useReducer, useContext } from 'react';

const Classes = React.createContext();

export const ClassList = ({ children }) => {
	const listReducer = (state, action) => {
		switch (action.type) {
			case 'addClass':
				let rand = Math.floor(Math.random()*99999);
				while(state.filter(e => e.id == rand).length != 0) {
					rand = Math.floor(Math.random()*99999);
				}
				return [...state, {section: action.payload.section, title: action.payload.title, sums: action.payload.sums, assignments: action.payload.data, id: rand}];
			case 'editClass':
				let index = state.findIndex(e => e.id === action.payload.id);
				state[index] = {...state[index], [action.payload.parameter]: action.payload.newValue};
				return state;
			case 'deleteClass':
				return state.filter(e => e.id !== action.payload)
			default:
				return state;
		}
	};
	
	const [classes, dispatch] = useReducer(listReducer, []);
	
	const addClass = ( title, section, data, sums ) => {
		dispatch({type: "addClass", payload: {title, section, data: data ?? [[]], sums: sums}});
	};
	const editClass = ( id, parameter, newValue ) => {
		dispatch({type: "editClass", payload: {id, parameter, newValue}});
	};
	const deleteClass = ( id ) => {
		dispatch({type: "deleteClass", payload: id});
	};
	
	return <Classes.Provider value={{classes, addClass, editClass, deleteClass }}>{children}</Classes.Provider>;
};

export default Classes;

// maybe I should organize the classes better... right, now they have:
// a section
// a title
// a unique id
// the list of assignments
// the total number of points received and possible, under an array called "points"
