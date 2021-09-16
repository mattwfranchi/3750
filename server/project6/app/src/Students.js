import React from 'react'; 
import GradesTable from './GradesTable'
import {List, NumberField, ReferenceField} from 'react-admin'; 
import {Create, Edit, SimpleForm, TextInput, NumberInput, Datagrid, TextField, EditButton, Show, SimpleShowLayout, required} from 'react-admin'; 




export function StudentsList(props) {
	return( 
		<List {...props}>
			<Datagrid>
				<TextField source="id" />
				<TextField source="name" />
			</Datagrid>
		</List>
	
	);
	
}

export function StudentsShow(props) {
	//console.log(props);
	return( 
		
		<Show {...props}>
			<SimpleShowLayout>
				<TextField source="id" />
				<TextField source="name" />
				<GradesTable {...props} />
			</SimpleShowLayout>
		</Show>
	);
	
}

export function StudentsEdit(props) {
	return( 
		<Edit {...props}>
			<SimpleForm> 
				<TextField source="id" />
				<TextInput source="name" />
			</SimpleForm>
		</Edit>
	);
	
}

export function StudentsCreate(props) {
	return( 
		<Create {...props}>
			<SimpleForm> 
				<TextInput source="id" validate={required()}/>
				<TextInput source="name" validate={required()}/>
			</SimpleForm>
		</Create>
	);
	
}