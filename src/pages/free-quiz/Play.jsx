import classnames from 'classnames';
import M from 'materialize-css';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import Loader from '../../components/common/Loader';

import { endFreeQuiz, getFreeQuestions } from '../../actions/quizActions';

import isEmpty from '../../validation/is-empty';

import buttonSound from '../../assets/audio/button-sound.mp3';
import correctNotification from '../../assets/audio/correct-answer.mp3';
import wrongNotification from '../../assets/audio/wrong-answer.mp3';

class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            questions: [],
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 0,
            numberOfAnsweredQuestions: 0,
            currentQuestionIndex: 0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 10,
            fiftyFifty: 2,
            usedFiftyFifty: false,
            loading: false,
            previousButtonDisabled: true,
            nextButtonDisabled: false,
            previousRandomNumbers: [],
            time: {}
        };
        this.interval = null
    }

    componentDidMount() {
        this.props.getFreeQuestions();
        this.setState({
            loading: true
        });
        this.startTimer();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!isEmpty(nextProps.quiz)) {
            this.setState({
                questions: nextProps.quiz.questions,
                type: nextProps.quiz.type,
                numberOfQuestions: nextProps.quiz.numberOfQuestions,
                loading: false
            }, () => {
                this.displayQuestion(this.state.questions);
                this.handleDisableButton();
            });
        }
    }

    handleDisableButton = () => {
        if (this.state.previousQuestion === undefined || this.state.currentQuestionIndex === 0) {
            this.setState({
                previousButtonDisabled: true
            });
        } else {
            this.setState({
                previousButtonDisabled: false
            });
        }

        if (this.state.nextQuestion === undefined || this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions) {
            this.setState({
                nextButtonDisabled: true
            });
        } else {
            this.setState({
                nextButtonDisabled: false
            });
        }
    }

    displayQuestion(questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                answer,
                previousRandomNumbers: []
            }, () => {
                this.showOptions();
                this.handleDisableButton();
            });
        }
    }

    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            document.getElementById('correct-audio').play();
            setTimeout(() => {
                this.correctAnswer();
            }, 500);
        } else {
            document.getElementById('wrong-audio').play();
            setTimeout(() => {
                this.wrongAnswer();
            }, 500);
        }

        if (this.state.numberOfQuestions === 0) {
            const questionsArray = Object.keys(this.state.questions).map(i => this.state.questions[i]);
            this.setState({
                numberOfQuestions: questionsArray.length
            });
        }
    }

    handleNextButtonClick = (e) => {
        if (!this.state.nextButtonDisabled) {
            this.playButtonSound();
            if (this.state.nextQuestion !== undefined) {
                this.setState((prevState) => ({
                    currentQuestionIndex: prevState.currentQuestionIndex + 1
                }), () => {
                    this.displayQuestion(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
                });
            }
        }
    };

    handlePreviousButtonClick = (e) => {
        if (!this.state.previousButtonDisabled) {
            this.playButtonSound();
            if (this.state.previousQuestion !== undefined) {
                this.setState((prevState) => ({
                    currentQuestionIndex: prevState.currentQuestionIndex - 1
                }), () => {
                    this.displayQuestion(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
                });
            }
        }
    }

    hadleQuitButtonClick = (e) => {
        this.playButtonSound();
        if (window.confirm('Are you sure you want to quit?')) {
            this.props.navigate('/');
        }
    }

    handleLifeline = (e) => {
        switch (e.target.id) {
            case 'fiftyfifty':
                if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
                    this.handleFiftyFifty();
                    this.setState((prevState) => ({
                        fiftyFifty: prevState.fiftyFifty - 1
                    }));
                }
                break;

            default:
                break;
        }
    }

    handleFiftyFifty = () => {
        const options = document.querySelectorAll('.option');
        const randomNumbers = [];
        let indexOfAnswer;

        options.forEach((option, index) => {
            if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                indexOfAnswer = index;
            }
        });

        let count = 0;
        do {
            const randomNumber = Math.round(Math.random() * 3);
            if (randomNumber !== indexOfAnswer) {
                if (randomNumbers.length < 2) {
                    if (!randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                        randomNumbers.push(randomNumber);
                        count++;
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if (!randomNumbers.includes(newRandomNumber) && newRandomNumber !== indexOfAnswer) {
                                randomNumbers.push(newRandomNumber);
                                count++;
                                break;
                            }
                        }
                    }
                }
            }
        } while (count < 2);
        options.forEach((option, index) => {
            if (randomNumbers.includes(index)) {
                option.style.visibility = 'hidden';
            }
        });
        this.setState({
            usedFiftyFifty: true
        });
    }

    handleHints = () => {
        if (this.state.hints > 0) {
            let options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;


            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            while (true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if (index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hints: prevState.hints - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }));
                        }
                    });
                    break;
                }

                if (this.state.previousRandomNumbers.length >= 3) break;
            }
        }
    }

    showOptions = () => {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.style.visibility = 'visible';
        });
        this.setState({
            usedFiftyFifty: false
        });
    };

    correctAnswer = () => {
        M.toast({
            html: 'Correct Answer!',
            classes: 'toast-valid',
            displayLength: 1500
        });
        this.setState((prevState) => ({
            score: prevState.score + 1,
            correctAnswers: prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1,
        }), () => {
            if (this.state.nextQuestion === undefined) {
                setTimeout(() => {
                    this.endGame();
                }, 1000);
            } else {
                this.displayQuestion(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    }

    wrongAnswer = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer!',
            classes: 'toast-invalid',
            displayLength: 1500
        });
        this.setState((prevState) => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestions: prevState.numberOfAnsweredQuestions + 1
        }), () => {
            if (this.state.nextQuestion === undefined) {
                setTimeout(() => {
                    this.endGame();
                }, 1000);
            } else {
                this.displayQuestion(this.state.questions, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            }
        });
    }

    endGame = () => {
        const { state } = this;
        const playerStats = {
            score: state.score,
            numberOfQuestions: state.numberOfQuestions,
            numberOfAnsweredQuestions: state.numberOfAnsweredQuestions,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,
            fiftyFiftyUsed: 2 - state.fiftyFifty,
            hintsUsed: 10 - state.hints
        };
        this.props.endFreeQuiz(playerStats);
        setTimeout(() => {
            this.props.navigate('/play/quizSummary');
        }, 1000);
    }

    startTimer = () => {
        const countDownTime = Date.now() + 1800000;
        this.interval = setInterval(() => {
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (distance < 0) {
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    this.endGame();
                });
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds
                    }
                });
            }
        }, 1000);
    }

    playButtonSound = () => {
        document.getElementById('button-sound').play();
    }

    render() {
        const {
            currentQuestion,
            currentQuestionIndex,
            numberOfQuestions,
            hints,
            fiftyFifty,
            time,
            loading
        } = this.state;

        if (loading || this.state.questions.length === 0) {
            return <Loader />;
        }

        return (
            <Fragment>
                <Helmet><title>Play Quiz</title></Helmet>
                <Fragment>
                    <audio id="correct-audio" src={correctNotification}></audio>
                    <audio id="wrong-audio" src={wrongNotification}></audio>
                    <audio id="button-sound" src={buttonSound}></audio>
                </Fragment>
                <div className="questions">
                    <h2>{this.state.type}</h2>
                    <div className="lifeline-container">
                        <p>
                            <span onClick={this.handleHints} className="lifeline"> <span className="mdi mdi-lightbulb-on mdi-24px lifeline-icon"></span>{hints}</span>
                        </p>
                        <p>
                            <span onClick={this.handleLifeline} id="fiftyfifty" className="lifeline"> <span className="mdi mdi-set-center mdi-24px lifeline-icon"></span>{fiftyFifty}</span>
                        </p>
                    </div>
                    <div className="timer-container">
                        <p>
                            <span className="left">{currentQuestionIndex + 1} of {numberOfQuestions}</span>
                            <span className="right">{time.minutes}:{time.seconds}</span>
                        </p>
                    </div>
                    <h5>{currentQuestion.question}</h5>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                    </div>

                    <div className="button-container">
                        <button id="previous-button" onClick={this.handlePreviousButtonClick} className={classnames('', { 'disable': this.state.previousButtonDisabled })}>Previous</button>
                        <button id="next-button" onClick={this.handleNextButtonClick} className={classnames('', { 'disable': this.state.nextButtonDisabled })}>Next</button>
                        <button id="quit-button" onClick={this.hadleQuitButtonClick}>Quit</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

Play.propTypes = {
    quiz: PropTypes.object.isRequired,
    getFreeQuestions: PropTypes.func.isRequired,
    endFreeQuiz: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
    quiz: state.quiz
});

export default connect(mapStateToProps, { endFreeQuiz, getFreeQuestions })(Play);
