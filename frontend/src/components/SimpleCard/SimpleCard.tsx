import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box, CardHeader } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    minWidth: 200,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export const SimpleCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  console.log(theme);
  console.log(theme.palette.primary.light);
  const { title, text, button } = props;

  return (
    <Card className={classes.root}>
      <Box>
        <Typography variant="h6" component="h2" color="textSecondary">
          {title}
        </Typography>
      </Box>
      <CardContent>
        <Typography variant="body2" component="p">
          {text}
        </Typography>
      </CardContent>
      <CardActions>{button}</CardActions>
    </Card>
  );
};
