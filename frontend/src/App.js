import React, {useState,useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import './fonts/ACROTSRG.TTF'

const REMOTE_ADDR = "http://45.33.13.215:4502";

const axios = require('axios');

const ClickSubmitButton = (input) => {
	input.addEventListener("keydown", function(event) {
	  if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("submit").click();}
	});	
}


const StartPage = ()=>{
	const [text,setText] = useState("");
	const [loaded,setLoaded] = useState(null);
	const [username,setUsername] = useState("");
	
	const SubmitUsername = (e)=>{
		setText(<>
		<span className="slowblink">
		Communicating with the celestials...
		</span></>);
	}
	const UpdateUsername = (e)=>{
		setUsername(e.currentTarget.value);
	}
	
	useEffect(()=>{setTimeout(()=>{
		setText(<span className="fadein3">Well hello there...</span>);
	},4000)},[loaded])
	useEffect(()=>{setTimeout(()=>{
		setText(<span className="fadein3">I see this is your first time here.</span>);
	},8000)},[loaded])
	useEffect(()=>{setTimeout(()=>{
		setText(<span className="fadein3">Tell me your name...</span>);
	},12000)},[loaded])
	useEffect(()=>{setTimeout(()=>{
		setText(<><span className="fadein3">Tell me your name...</span>
		<input type="text" id="username" className="starbox" onChange={(e)=>{UpdateUsername(e)}}/>
		<button className="starbox" onClick={(e)=>SubmitUsername()} id="submit">Continue</button>
		</>);
		document.getElementById("username").focus();
		ClickSubmitButton(document.getElementById("username"));
	},14000)},[loaded])
	return (<div className="container stars border rounded shadow-sm">
		<div className="row">
			<div className="col-md-12 header text-center">
				<span className="glowHeavy animated fadein">ASTRONOMY</span>
			</div>
		</div>
		<div className="row">
			<div className="col-md-12 text-center">
				{text}
			</div>
		</div>
    </div>);
}

function App() {
	const [data,setData] = useState([]);
	const [loaded,setLoaded] = useState(null);
	const [page,setPage] = useState(null);

	useEffect(()=>{
		axios.get(REMOTE_ADDR)
		.then((data)=>{
			setData(data.data);
			console.log(data);
		})
	},[loaded]);
	switch (page) {
		default:{
			return <StartPage/>;
		}
	}
}

export default App;
