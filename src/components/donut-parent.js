import Donut from "./donut";
import '../../src/styles/donut-parent.css'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { env } from '../environments';
import ChartTable from "../common-components/ChartTable";

function DonutParent() {

    const [data, setData] = useState([]);

    const colorArr = ['#8b7dbe', '#9dc384', '#f1bf44', '#69bbc4', '#f1bf44']

    useEffect(() => {
        axios({
            method: 'get',
            url: `${env.BASE_URL}:${env.PORT}/udops/corpus/donut/`,
            withCredentials: false,
        })
            .then(res => {
                const formattedData = [];
                let data = res.data;
                for (let i = 0; i < data.length; i++) {
                    let obj = {};
                    obj['name'] = data[i].name;
                    obj['labels'] = data[i].labels;
                    let datasetArr = [];
                    let datasetObj = {};
                    datasetObj['lable'] = '';
                    datasetObj['data'] = JSON.parse(data[i].dataset[0].data);
                    let bgArr = [];
                    for (let j = 0; j < datasetObj['data'].length; j++) {
                        bgArr.push(colorArr[j % 5]);
                    }
                    datasetObj['backgroundColor'] = bgArr;
                    datasetObj['hoverOffset'] = 0;
                    datasetObj['hoverBorderWidth'] = 0;
                    datasetObj['borderColor'] = 'white';
                    datasetObj['hoverBorderDashOffset'] = 80;
                    datasetArr.push(datasetObj);
                    obj['datasets'] = datasetArr;
                    formattedData.push(obj);
                }
                setData(formattedData);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <>
            {
                data.length > 0 ?
                <> 
                    <div className="donut-parent-container">
                        <div className="left">
                            <Donut data={data[0]} />
                            <Donut data={data[1]} />
                        </div>
                        <div className="right">
                            <Donut data={data[2]} />
                            <Donut data={data[3]} />
                            <Donut data={data[4]} />
                        </div>
                    </div> 
                    </>
                    :
                    null
            }
        </>
    );
}

export default DonutParent;