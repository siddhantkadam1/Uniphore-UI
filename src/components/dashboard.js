import '../../src/App.css';
import Donut from './donut'
import DonutParent from './donut-parent'
import "../../src/App.css";
import "../../src/styles/dashboard.css";
import Navbar from "./navbar";
import { Box } from "@mui/system";
import axios from 'axios';
import corpusIcon from "../../src/assets/corpus-icon.png";
import datasetIcon from "../../src/assets/dataset-icon.png";
import { useEffect, useState } from 'react';
import { env } from '../environments';
import ChartTable from '../common-components/ChartTable';


function Dashboard() {

  const [count, setCount] = useState(null);
  const [datasetCount, setDatasetCount] = useState(null);

  useEffect(() => {

    axios({
      method: 'get',
      url: `${env.BASE_URL}:${env.PORT}/udops/corpus/count/`,
      withCredentials: false,
    })
      .then(response => {
        setCount(response.data.data[0].count)
      })
      .catch(error => {
        console.error(error);
      });

    axios({
      method: 'get',
      url: `${env.BASE_URL}:${env.PORT}/udops/dataset/count/`,
      withCredentials: false,
    })
      .then(response => {
        setDatasetCount(response.data.data[0].count)
      })
      .catch(error => {
        console.error(error);
      });

  }, []);


  return (
    <div className="App">
      <Navbar />
      <div className="dashboard-info-header-container">
        <div className="dashboard-info-heading">
          <h2 className="section-heading">Dashboard</h2>
        </div>
      </div>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-heading">
            <p className="dashboard-card-heading-title">Total Corpus</p>
          </div>
          <div className="dashboard-card-details">
            <div className="dashboard-card-details-info-icon">
              <img src={corpusIcon} alt="corpus" />
            </div>
            <div className="dashboard-card-details-info-count">
              <p className="dashboard-card-details-info-count-title">{count}</p>
            </div>
          </div>
        </div>
        {/* <div className="dashboard-card">
          <div className="dashboard-card-heading">
            <p className="dashboard-card-heading-title">Total Datasets</p>
          </div>
          <div className="dashboard-card-details">
            <div className="dashboard-card-details-info-icon">
              <img src={datasetIcon} alt="dataset" />
            </div>
            <div className="dashboard-card-details-info-count">
              <p className="dashboard-card-details-info-count-title">{datasetCount}</p>
            </div>
          </div>
        </div> */}
      </div>
      <DonutParent />
    </div>
  );
}

export default Dashboard;
