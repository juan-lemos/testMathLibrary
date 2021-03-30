/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import MathView, { MathViewRef } from 'react-math-view';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError,
} from 'containers/App/selectors';

import Banner from 'components/Header/banner.jpg';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const key = 'home';

export function HomePage({
  username,
  loading,
  error,
  repos,
  onSubmitForm,
  onChangeUsername,
}) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  useEffect(() => {
    // When initial state username is not null, submit the form to load repos
    if (username && username.trim().length > 0) onSubmitForm();
  }, []);

  const reposListProps = {
    loading,
    error,
    repos,
  };
  const [number, changeNumberSet] = React.useState(0);

  return (
    <article>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A React.js Boilerplate application homepage"
        />
      </Helmet>

      <button onClick={() => changeNumberSet(number + 1)}>NEXT</button>
      {number % 2 === 0 ? (
        <div>1{<InputComponent key={'3'} number={number} />}</div>
      ) : (
        // <div>2{<InputComponent key={'32'} number={number} />}</div>
        ''
      )}
      <div style={{ height: '100vh' }} />
    </article>
  );
}

function InputComponent({ number }) {
  return (
    <>
      <div>Input </div>
      <div>Current Number {number}</div>
      <div style={{ background: 'skyblue' }}>
        <MathView
          readOnly={false}
          onChange={e => {
            console.log(e.currentTarget.getValue());
          }}
          onMathFieldFocus={e => {
            e.target.executeCommand('showVirtualKeyboard');
          }}
          onMathFieldBlur={e => {
            e.target.executeCommand('hideVirtualKeyboard');
          }}
          id={`openQuestionInput${Math.random()}`}
          style={{ fontSize: 'larger' }}
        />
      </div>
      {/* <img src={Banner} alt="react-boilerplate - Logo" />
      <img src={Banner} alt="react-boilerplate - Logo" /> */}
    </>
  );
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  username: makeSelectUsername(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(HomePage);
