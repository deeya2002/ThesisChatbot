// import React, { Component, Fragment } from 'react';
// import { Helmet } from 'react-helmet';
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

// class Home extends Component {

//     componentDidMount () {
//         // if (this.props.auth.authenticated) {
//         //     this.props.history.push('/dashboard');
//         // }
//     }

//     render () {
//         return (
//             <Fragment>
//                 <Helmet><title>Instaquiz - Home</title></Helmet>
//                 <div id="home">
//                     <section>
//                         <div style={{ textAlign: 'center' }}>
//                             <span className="mdi mdi-cube-outline cube"></span>
//                         </div>
//                         <h1>InstaQuiz</h1>
//                         <div className="playButtonContainer">
//                             <ul>
//                                 <li>
//                                     <Link className="playButton" to="/play/instructions">Play</Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </section>
//                 </div>
//             </Fragment>
//         );
//     }
// }

// Home.propTypes = {
//     auth: PropTypes.object.isRequired
// };

// const mapStateToProps = (state) => ({
//     auth: state.auth
// });

// export default connect(mapStateToProps)(Home);

import '../css/home.css';


// class Home extends Component {
//     render() {
//         return (
//             <Fragment>
//                 <Helmet><title>Quiz - Home</title></Helmet>
//                 <div id="home">
//                     <section>
//                         <div style={{ textAlign: 'center' }}>

//                         </div>
//                         <h1>Quiz</h1>

//                         <button onClick={handleSubmit} type="submit"></button>
//                     </section>
//                 </div>
//             </Fragment>
//         );
//     }
// }

// export default Home;


import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handlePlayButtonClick = () => {
        navigate('/instructions');
    };

    return (
        <Fragment>
            <Helmet><title>Quiz - Home</title></Helmet>
            <div>
                <h1>Welcome to the Quiz</h1>
                <button onClick={handlePlayButtonClick}>Play</button>
            </div>
        </Fragment>
    );
};

export default Home;

