import logo from './logo.svg';
import {StudentsList,StudentsShow,StudentsEdit,StudentsCreate} from './Students.js'
import {GradesList, GradesEdit, GradesCreate} from './Grades.js'
import {fetchUtils, Admin, Resource} from 'react-admin'; 
import jsonServerProvider from 'ra-data-json-server';
//import simpleRestProvider from 'ra-data-simple-rest'; 
import RestClient from './RestClient.js'

import './App.css';


const httpClient = (url, options={}) => {
	options.user = {
		authenticated: true, 
		token: 'Basic dGVhY2hlcjp0ZXN0aW5n'
	};
	return fetchUtils.fetchJson(url,options);
};


function App() {
	return( 
		<Admin dataProvider={RestClient('/project5',httpClient)} title="Project 6 Admin Panel">
			<Resource name="students" list={StudentsList} create={StudentsCreate} show={StudentsShow} edit={StudentsEdit}/>
			<Resource name="grades" list={GradesList} create={GradesCreate} edit={GradesEdit}/>
		
	
	
		</Admin>
	)
	
	
}

export default App;
