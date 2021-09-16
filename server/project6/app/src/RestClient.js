



/*export default function(apiUrl, httpClient = fetchUtils.fetchJson)
{
	const dataProvider = jsonServerProvider(apiUrl, httpClient); 
	
	const RestClient = { 
		...dataProvider, 
		
		getOne: (resource, params) => {
			console.log(params); 
			let data = {}; 
			if(resource == "students")
			{
			

				const grades = httpClient(`${apiUrl}/grades?student_id=${params.id}`);
				const student = dataProvider.getOne(resource,params);
				console.log(Promise.all([grades,student]))
				Promise.all([grades,student]).then(function(result) {
					console.log({data: result});
					result[1].data.grades = result[0].json;
					const parsed_result = {
						data: result[1].data,
						
					};
					console.log(parsed_result);
					return new Promise(parsed_result);
				});
				
			}
			else
			{
				const grade =  dataProvider.getOne(resource,params); 
				console.log(grade);
				return grade;
			}
			
		},
		
		getMany: (resource, params) => {
			let results = [];
			const getOneParams = {
				id: "" 
			};
			for(const student of params.ids)
			{
				getOneParams.id = student; 
				results.push(dataProvider.getOne(resource,getOneParams))
			}
			return {data: Promise.all(results)}
		}
		
		
	};
	
	return RestClient;
};
*/
import { fetchUtils } from 'react-admin';
import jsonServerRestClient from 'ra-data-json-server';
const getListParams = {
	filter: {},
	pagination: {
		page: 1,
		perPage: 5000,
	},
	sort: {
		field: 'type',
		order: 'desc'
	}
}
const RestClient = (apiUrl, httpClient = fetchUtils.fetchJson) => {
	let baseClient = jsonServerRestClient(apiUrl, httpClient);
	return {
		getList: (resource, params)=> (baseClient.getList(resource, params)),
		getOne: (resource, params)=> {
			console.log(params); 
			let data = {}; 
			let student = {}; 
			const promises = []
			if(resource === "students")
			{
				
					/*return baseClient.getOne(resource,params).then(function(studentObj) {
						getListParams.filter.student_id = params.id
						student = studentObj.data;
						console.log(getListParams)
						console.log(student)
					}).then(baseClient.getList('grades',getListParams).then(function(grades) {
						student.grades = grades.data
						console.log(grades)
					})).then(() => {data:student})*/
				
						
					let student_processed = baseClient.getOne(resource,params)
											.then(function(studentObj) {
												getListParams.filter.student_id = params.id;
												student = studentObj.data
												return getListParams
											})
											.then(function(getListParams) {
												return baseClient.getList('grades',getListParams) 
										  	})
											.then(function(grades) {
												student.grades = grades.data
												//console.log(student)
												return {data:student}
											})	
											
												
					//console.log(student_processed)
					return student_processed
	
				
				
							   
				
				
				
				
				//console.log(Promise.all(promises).then(()=>({data:student})))
				//return Promise.all(promises).then(()=>({data:student}))
				
				

			
				
				
			}
			else
			{
				return (baseClient.getOne(resource,params))
			}
		},
		getMany: (resource, params)=>{
			console.log('getMany params',params);
			const promises = [];
			const results = [];
			for(let i = 0;i<params.ids.length;i++){
				const id = params.ids[i];
				promises.push(
					baseClient.getOne(resource, {id})
						.then((response)=>{
							results.push(response.data);
						})
				)
			}
			return Promise.all(promises).then(()=>({data:results}))
		},
		getManyReference: (resource, params)=>(baseClient.getManyReference(resource, params)),
		update: (resource, params)=>(baseClient.update(resource, params)),
		updateMany: (resource, params)=>(baseClient.updateMany(resource, params)),
		create: (resource, params)=>(baseClient.create(resource, params)),
		delete: (resource, params)=>(baseClient.delete(resource, params)),
		deleteMany: (resource, params)=>(baseClient.deleteMany(resource, params))
	};	
};
export default RestClient;
	
	
	


