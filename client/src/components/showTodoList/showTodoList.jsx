
import { useState, useEffect } from "react";
import axios from "axios";
// import { UpdateTodo } from "./updateTodo"; // added

import './showTodoList.scss';


function TodoCard({ data, handleDelete }) {
    const { _id, title, done } = data;
    let classDone, classCheck, classActive;


    function inputChange(e) {
        this.setState({title: e.target.value.replace (/ +/g, ' ')})
    }

    function onFocus(e) {
        e.currentTarget.classList.add("to-do__text-active")
    }

    function onBlur(e) {
        e.currentTarget.classList.remove("to-do__text-active"); 
        this.setState({ 
            title: this.props.title      
        })      
    }

    function handleKeyDown(e){
        if(e.keyCode === 13){
            e.preventDefault();
            e.currentTarget.setAttribute("readonly", "true")
            e.currentTarget.classList.remove("to-do__text-active");
            this.props.updateData(
                this.state.id,
                this.state.title,
            );
            if(!this.state.title.length) {
                this.setState({ 
                    title: this.props.title      
                })
            } 
        } 
          
    }

    function removeAttribute(e) {
        e.currentTarget.classList.add("to-do__text-active");
        e.currentTarget.removeAttribute("readonly", "true")
    }
      
    if(done){
      classDone = "to-do__text to-do__done";
      classCheck = "to-do__checkbox to-do__checkbox-actve";
      classActive = "to-do__checkbox-check to-do__checkbox-check-active";
    } else {
        classDone = "to-do__text";
        classCheck = "to-do__checkbox";
        classActive = "to-do__checkbox-check";
    }  

    return (
        <li className="to-do__list-li" key={_id} >
        <label  className={classCheck} htmlFor="checkItem"></label>
            <input id="checkItem"
                className="to-do__checkbox-input" 
                type="checkbox"
            />
            <img className={classActive} src="/img/check.svg" alt="check" />
            <input            
                className={classDone}
                type="text"
                onClick={removeAttribute} 
                onChange={inputChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                done={done}
                value={title}
                name={_id}
                id={_id}  
            />    
        <button className="to-do__checkbox-btn" 
            name={_id} 
            onClick={handleDelete}>
            <img className="to-do__checkbox-cross" src="/img/cross.svg" alt="delete"/>
        </button>
    </li>      
    );
    
}

export function ShowTodoList() {
    const [todo, setTodo] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/todo")
            .then((res) => {
                console.log(res.data);
                setTodo(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    function handleDelete(e) {
        axios.delete(`http://localhost:8000/api/todo/${e.target.name}`);

        setTodo((data) => {
            return data.filter((todo) => todo._id !== e.target.name);
        });
    }

    return (
        <section className="container">
            <section className="contents">
                <ul className="list-container">
                    {todo.map((data) => (
                        <TodoCard data={data} handleDelete={handleDelete}/>
                    ))}
                </ul>
            </section>
        </section>
    );
}