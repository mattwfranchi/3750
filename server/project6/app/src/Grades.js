// Matt Franchi // CPSC 3750 // Project 6 
// Grades.js 
// Program description:


// IMPORTS
import React from 'react'; 
import {List, NumberField, ReferenceField} from 'react-admin'; 
import {Create, Edit, SimpleForm, TextInput, NumberInput, Datagrid, TextField, EditButton, required} from 'react-admin'; 


export function GradesList(props) {
	
	return ( 
	
	<List {...props}>
		<Datagrid> 
			<TextField source="id" />
			<ReferenceField label="Student Name" source="student_id" reference="students">
				<TextField source="name" />
			</ReferenceField>
			<TextField source="type" />
			<NumberField source="grade" />
			<NumberField source="max" />
		</Datagrid>
	</List> 
	
	);
	
	
	
}


export function GradesEdit(props) {
	
	return( 
		<Edit {...props}>
			<SimpleForm> 
				<TextField source="id" />
				<ReferenceField label="Student ID" source="student_id" reference="students">
					<TextField source="name" />
				</ReferenceField>
				<TextInput source="type" validate={required()} />
				<NumberInput source="max" validate={required()} />
				<NumberInput source="grade" validate={required()} /> 
			</SimpleForm>
		</Edit>
	);
	
	
}

export function GradesCreate(props) {
	
	return ( 
		<Create {...props}>
			<SimpleForm> 
				<TextInput source="student_id" validate={required()} />
				<TextInput source="type" validate={required()} />
				<NumberInput source="max" validate={required()} />
				<NumberInput source="grade" validate={required()} />

			</SimpleForm>

		</Create>
	
	);
	
}