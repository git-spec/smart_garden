import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'



const Login = (props) => {

    const history = useHistory()
    const initialState = {
      email: '',
      password: '',
    }
    const [myState, setMyState] = useState(initialState)
  
    const onLoginBtnClick = (e) => {
      e.preventDefault()
      console.log('Email: '+myState.email, 'Password: '+myState.password);
    }
  
    return (
      <React.Fragment>
        <section className="static about-sec">
          <div className="container">
            <h1>My Account / login</h1>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              Lorem Ipsum has been the industry's printer took a galley of type and scrambled
              it to make a type specimen book. It has survived not only fiveLorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
            </p>
            <div className="form">
              <form>
                <div className="row">
                  <div className="col-md-4">
                    <input
                      type="email"
                      placeholder="Enter User Name Or "
                      required
                      onChange={(e) => {
                      setMyState({
                        ...myState,
                        email: e.target.value
                      })
                    }}
                      value={myState.email}/>
                    <span className="required-star">*</span>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                      setMyState({
                        ...myState,
                        password: e.target.value
                      })
                    }}
                      value={myState.password}/>
                    <span className="required-star">*</span>
                  </div>
  
                  <div className="col-md-4">
                    <button className="btn black" onClick={onLoginBtnClick}>Login</button>
                    <h5>not Registered?
                      <Link to="/register">register here</Link>
                    </h5>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </React.Fragment>
    )
  }
  
  export default Login