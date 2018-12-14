/**
 * Created by liuliyuan on 2018/9/14.
 */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './index.less'
const Loader = (props) => { //{spinning, fullScreen}
  return (<div className={classNames(styles.loader, {
    [styles.hidden]: !props.isLoading, //!spinning,
    [styles.fullScreen]: props.fullScreen,
  })}
  >
    <div className={styles.warpper}>
      <div className={styles.inner}/>
      <div className={styles.text}>LOADING</div>
    </div>
  </div>)
}
/*Loader.propTypes = {
 spinning: PropTypes.bool,
 fullScreen: PropTypes.bool,
 }*/
export default Loader
