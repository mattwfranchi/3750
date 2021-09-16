import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {fetchUtils, useDataProvider} from 'react-admin';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(id, type, max, grade) {
	return {id, type, max, grade};
}



// genGradesTable function -> returns basic material-ui table 
export default function (props) {
	const dataProvider = useDataProvider();
	console.log(props.id)
	console.log(props)


  const classes = useStyles();
	const params = {
		id: props.id
	}
	
	let grades = [];
	let rows = props.record.grades;
	
	
	return (
		<TableContainer component={Paper}>
		  <Table className={classes.table} aria-label="simple table">
			<TableHead>
			  <TableRow>
				<TableCell>Grade ID</TableCell>
				<TableCell align="right">Type</TableCell>
				<TableCell align="right">Max</TableCell>
				<TableCell align="right">Grade</TableCell>
			  </TableRow>
			</TableHead>
			<TableBody>
			  {rows.map((row) => (
				<TableRow key={row.id}>
				  <TableCell component="th" scope="row">
					{row.id}
				  </TableCell>
				  
				  <TableCell align="right">{row.type}</TableCell>
				  <TableCell align="right">{row.max}</TableCell>
				  <TableCell align="right">{row.grade}</TableCell>
				</TableRow>
			  ))}
			</TableBody>
		  </Table>
		</TableContainer>
	  );
	
	

  
}