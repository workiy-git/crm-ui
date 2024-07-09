import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useFeatureContext } from '../../components/atoms/mainwidget';

const useStyles = makeStyles({
  createWidget: {
    width: '18%',
    height: 100,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    marginTop: '5%',
    marginLeft: '5%',
  },
  icon: {
    width: '30px',
    height: '30px',
    marginLeft: '-1%',
  },
  title: {
    marginLeft: '-1%',
  },
  gridContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
});

const CreateWidget = ({ backgroundColor }) => {
  const { selectedFeatures } = useFeatureContext();
  const classes = useStyles();

  return (
    <div className={classes.gridContainer}>
      {selectedFeatures.map((feature, index) => (
        <div key={index} className={classes.createWidget} style={{ background: backgroundColor }}>
          <img src={feature.icon} alt={feature.title} className={classes.icon} />
          <span className={classes.title}>{feature.title}</span>
        </div>
      ))}
    </div>
  );
};

export default CreateWidget;
