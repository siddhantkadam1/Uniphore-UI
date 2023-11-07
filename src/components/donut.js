
import '../../src/styles/donut.css'

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
} from 'chart.js';

import { Doughnut, } from 'react-chartjs-2'
import ChartTable from '../common-components/ChartTable';

ChartJS.register(
    ArcElement,
    Tooltip,
);

function Donut(props) {
    const data = JSON.parse(JSON.stringify(props.data));
    if (data.datasets[0].data.length > 10) {
        data.datasets[0].data = JSON.parse(JSON.stringify(data.datasets[0].data.slice(0, 10)));
        data.labels = JSON.parse(JSON.stringify(data.labels.slice(0, 10)));
    }
    const options = {
        cutout: 50,
    };

    return (
        <div>
            <div className="donut-container" id='doughnut-chart' >
                <Doughnut data={data}
                    options={options} id='doughnut-chart'>
                </Doughnut>
            </div>
            <p className='name'>{data.name}</p>
            <ChartTable data={props.data} />
        </div>
    );
}

export default Donut;
