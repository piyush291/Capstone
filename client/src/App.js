import React, { Component } from "react";
import SimpleStorage from "./contracts/SimpleStorage.json";
import DistributorRole from "./contracts/DistributorRole.json";
import PatientRole from "./contracts/PatientRole.json";
import PharmacistRole from "./contracts/PharmacistRole.json";
import ManufacturerRole from "./contracts/ManufacturerRole.json";
import getWeb3 from "./getWeb3";
import "./App.css";
import {Admin} from "./MyComponents/Admin"
import { Form } from "./MyComponents/Form";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MainPage } from "./MyComponents/MainPage";
import { MakeMedicine } from "./MyComponents/MakeMedicine";
import { UpdateMedic } from "./MyComponents/UpdateMedic";
import { Patient } from "./MyComponents/Patient";
import { Distributor } from "./MyComponents/Distributor";
import Navbar from "./MyComponents/Navbar";

class App extends Component {
  // contract represents SimpleStorage
  // dist is for DistributorRole
  state = { web3: null, accounts: null, contract: null , dist : null, 
            manu:null, pharm: null, pat: null, currentForm:'Manufacturer'};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      // get the contract instance of SimpleStorage
      const deployedNetwork = SimpleStorage.networks[networkId];
      const instance = new web3.eth.Contract(SimpleStorage.abi,deployedNetwork.address);

      // get the contract instance of Distributor
      const distributorData = DistributorRole.networks[networkId];
      const distributor = new web3.eth.Contract(DistributorRole.abi, distributorData.address)

      // get the contract instance of Pharmacist
      const PharmacistData = PharmacistRole.networks[networkId];
      const pharmacist = new web3.eth.Contract(PharmacistRole.abi, PharmacistData.address)

      // get the contract instance of Patient
      const PatientData = PatientRole.networks[networkId];
      const Patient = new web3.eth.Contract(PatientRole.abi, PatientData.address)

      // get the contract instance of Manufacturer
      const ManufacturerData = ManufacturerRole.networks[networkId];
      const manufacturer = new web3.eth.Contract(ManufacturerRole.abi, ManufacturerData.address)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance , dist: distributor, 
                      manu: manufacturer, pat: Patient, pharm: pharmacist});
       
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  UpdateMed = async(upc) =>{
    const { accounts, contract } = this.state;
    alert("working");
    console.log("this is for checking purpose");
    console.log(accounts[0]);

    // if(funcid == 1){
    await contract.methods.packMedicine(upc).send({from : accounts[0]});
    
  }

  

  fetch_state = async(upc) =>{
    const { accounts, contract } = this.state;
    alert("working");
    const response = await contract.methods.fetchstate(upc).call();

    // console.log( response);     
    // console.log(response);
    var t = response;
    console.log(t);
    return t;
    
  }



  sendtochain = async (t) => {
    const { accounts, contract } = this.state;
    alert("working");
    console.log("this is for checking purpose");
    console.log(accounts[0]);
    const name = t.Name;
    const price = t.Price;
    const upc = t.UPC;
    const ownerid = t.OwnerID;
    const manufacturername = t.manufacturername;
    const Latitude = t.originFactoryLatitude;
    const Longitude = t.originFactoryLongitude;
    const factoryinfo = t.originFactoryInformation;
    const notes = t.medicineNotes;


    console.log(name);
    console.log(upc);
    console.log(price);
    console.log(ownerid);
    console.log(manufacturername);
    console.log(Latitude);
    console.log(Longitude);
    console.log(factoryinfo);
    console.log(notes);


    await contract.methods.makeMedicine(upc, accounts[0], manufacturername, factoryinfo, Latitude, Longitude, notes).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();

    // Update state with the result.
    // this.setState({ storageValue: response });
    //await contract.methods.set(1).send({from : account  s[0]});

    //  const response = await contract.methods.fetchMedicine(upc).call();

    //  this.setState({storageValue: response});
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    alert("called");
    // Stores a given value, 5 by default.

  };

  
  IsDistributor = async() => {
    const { dist } = this.state;
    
    let acc = this.state.accounts[0]; // account by which we are accessing
    const ans = await dist.methods.isDistributor(acc).call();

  };
  
  IsPharmacist = async() => {
    const { pharm } = this.state;
    
    let acc = this.state.accounts[0]; // account by which we are accessing
    const ans = await pharm.methods.isPharmacist(acc).call();

  };

  IsPatient = async() => {
    const { pat } = this.state;
    
    let acc = this.state.accounts[0]; // account by which we are accessing
    const ans = await pat.methods.isPatient(acc).call();

  };

  IsManufacturer = async() => {
    const { manu } = this.state;
    
    let acc = this.state.accounts[0]; // account by which we are accessing
    const ans = await manu.methods.isManufacturer(acc).call();

  };

  render() {

    let content;
     
    if (!this.state.web3) {
      //content = <p id="loader" className="text-center">Loading Web3, accounts, and contract...</p>
      return <div>Loading Web3, accounts, and contract...</div>
    }
    if(this.IsDistributor)
    {
      this.setState({ currentForm: 'Distributor' })
      content = <Distributor/>
    }
    else if(this.IsPatient)
    {
      this.setState({ currentForm: 'Distributor' })
      content = <Patient fetch_state={this.fetch_state}/>
    }
    else if(this.IsPharmacist)
    {
      this.setState({ currentForm: 'Pharmacist' })
      //content = <Pharmacist/>
      return <p>Pharmacist Page</p>
    }
    else if(this.IsManufacturer)
    {
      this.setState({ currentForm: 'Manufacturer' })
      content = <Form />
    }
    else
    {
      return <p>Yor are not registered, contact admin</p>
    }

    return (
      <>
      <Navbar account={this.state.accounts[0]} />
      <div className="App container">

          <Routes>
          <Route path="/" element={<MainPage/>}> </Route>
          <Route  path="/admin" element={<Admin/>}></Route>
          <Route path="/manufacturer" element={<Form />}></Route>
          <Route path="/manufacturer/makemedicine" element={<MakeMedicine sendtochain={this.sendtochain}/>}> </Route> 
          <Route path="/manufacturer/UpdateMedic" element={<UpdateMedic UpdateMed={this.UpdateMed}/>}> </Route> 
          <Route path="/patient" element={<Patient fetch_state={this.fetch_state}/>}></Route>
          </Routes>
          
         
        
     
        {/* <Form sendtochain={this.sendtochain}/> */}
        {/* <h3>Congratulations manufacturer following block has been created and fetched from ganache blockchain</h3> */}

      </div>
      </>

    );
  }
}

export default App;
