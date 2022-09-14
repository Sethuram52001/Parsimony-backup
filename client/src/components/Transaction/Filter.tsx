import {
  Select,
  SelectChangeEvent,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { filterActions } from '../../store/filterSlice';

const Filter = () => {
  const dispatch = useDispatch();

  type dateFormatsType = {
    [key: string]: string;
  };

  const dateFormats: dateFormatsType = {
    Today: 'MMM DD',
    'This month': 'MMMM',
    'This year': 'YYYY',
  };

  const [timePeriod, setTimePeriod] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(
    moment().format(dateFormats[timePeriod])
  );

  const handleChange = (event: SelectChangeEvent) => {
    let timeSpan = event.target.value;
    setTimePeriod(timeSpan as string);
    setSelectedTime(moment().format(dateFormats[timeSpan]));
    if (timeSpan === 'Today') {
      dispatch(
        filterActions.setDate(
          moment()
            .set({ year: +moment().format('YYYY') })
            .format('YYYY-MM-DD') as string
        )
      );
    } else {
      dispatch(
        filterActions.setDate(moment().format(dateFormats[timeSpan]) as string)
      );
    }
    timeSpan =
      timeSpan === 'Today'
        ? 'Day'
        : timeSpan === 'This month'
        ? 'Month'
        : timeSpan === 'This year'
        ? 'Year'
        : '';
    dispatch(filterActions.setTimeSpan(timeSpan as string));
  };

  const decreaseTimePeriod = () => {
    let newSelectedTime = moment(selectedTime);
    if (timePeriod === 'Today') {
      newSelectedTime.subtract(1, 'days');
      dispatch(
        filterActions.setDate(
          newSelectedTime
            .set({ year: +moment().format('YYYY') })
            .format('YYYY-MM-DD') as string
        )
      );
    } else if (timePeriod === 'This month') {
      const month: number = +moment().month(selectedTime).format('M') - 1;
      newSelectedTime = moment().set('month', month);
      newSelectedTime.subtract(1, 'months');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timePeriod]) as string
        )
      );
    } else {
      newSelectedTime.subtract(1, 'years');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timePeriod]) as string
        )
      );
    }
    setSelectedTime(newSelectedTime.format(dateFormats[timePeriod]));
  };

  const increaseTimePeriod = () => {
    let newSelectedTime = moment(selectedTime);
    if (timePeriod === 'Today') {
      newSelectedTime.add(1, 'days');
      dispatch(
        filterActions.setDate(
          newSelectedTime
            .set({ year: +moment().format('YYYY') })
            .format('YYYY-MM-DD') as string
        )
      );
    } else if (timePeriod === 'This month') {
      const month: number = +moment().month(selectedTime).format('M') - 1;
      newSelectedTime = moment().set('month', month);
      newSelectedTime.add(1, 'months');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timePeriod]) as string
        )
      );
    } else {
      newSelectedTime.add(1, 'years');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timePeriod]) as string
        )
      );
    }
    setSelectedTime(newSelectedTime.format(dateFormats[timePeriod]));
  };

  return (
    <Box sx={{ width: '500px', display: 'flex' }}>
      <IconButton onClick={decreaseTimePeriod}>
        <ArrowLeft
          sx={{ color: '#FFF', background: '#000' }}
          fontSize="large"
        />
      </IconButton>
      <Box
        sx={{
          border: 'gray solid 0.5px',
          borderRadius: '3%',
          width: '150px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selectedTime}
      </Box>
      <Select
        sx={{ width: '150px' }}
        value={timePeriod}
        onChange={handleChange}
      >
        <MenuItem value={'Today'}>Today</MenuItem>
        <MenuItem value={'This month'}>This month</MenuItem>
        <MenuItem value={'This year'}>This year</MenuItem>
      </Select>
      <IconButton onClick={increaseTimePeriod}>
        <ArrowRight
          sx={{ color: '#FFF', background: '#000' }}
          fontSize="large"
        />
      </IconButton>
    </Box>
  );
};

export default Filter;
