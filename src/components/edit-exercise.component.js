import React, {Component} from 'react';
import { useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

function withParams(Component) {
return props => <EditExercise {...props} params={useParams()} />;
}
  

class EditExercise extends React.Component {
    constructor(props){
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


        this.state= {
            username: "",
            description: "",
            duration: 0,
            date: new Date(),
            users: []
        }
    }

    componentDidMount() {
        let { id } = this.props.params;
        console.log(id);
        axios.get('http://3.111.197.166:5012/exercises/'+id)
            .then(res => {               
                this.setState({
                    username: res.data.username,
                    description: res.data.description,
                    duration: res.data.duration,
                    date: new Date(res.data.date),
                })             
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get('http://3.111.197.166:5012/users')
            .then(res => {
                if(res.data.length > 0) {
                    this.setState({
                        users: res.data.map(user => user.username)
                    })
                }
            });
        
    }
        
    onChangeUsername(e){
        this.setState({
            username: e.target.value
        })
    }

    onChangeDescription(e){
        this.setState({
            description: e.target.value
        })
    }

    onChangeDuration(e){
        this.setState({
            duration: e.target.value
        })
    }

    onChangeDate(date){
        this.setState({
           date: date,
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }

        console.log(exercise);
        let { id } = this.props.params;
        axios.post('http://3.111.197.166:5012/exercises/update/'+id, exercise)
            .then(res => console.log(res.data));
        window.location = '/';
    }


    render() {
        return (
            <div>
                <h3>Edit Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <label>Username: </label>
                        <select  required className='form-control' 
                        value={this.state.username} onChange={this.onChangeUsername}>
                           {
                               this.state.users.map(function(user) {
                                   return <option key={user} value={user}>{user}</option>;
                               })
                           } 
                        </select> 
                    </div>

                    <div className='form-group'>
                        <label>Description: </label>
                        <input type='test' required className='form-control'
                        value={this.state.description} onChange={this.onChangeDescription} />
                    </div>

                    <div className='form-group'>
                        <label>Duration (in minutes): </label>
                        <input type='test' required className='form-control'
                        value={this.state.duration} onChange={this.onChangeDuration} />
                    </div>

                    <div className='form-group'>
                        <label>Date: </label>
                        <div>
                            <DatePicker
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                            />
                        </div>
                    </div>

                    <br/>

                    <div className='form-group'>
                        <input type='submit' value="Edit Exercise Log" className='btn btn-primary' />
                    </div>
                </form>
            </div>
        )
    }
}

export default withParams(EditExercise);