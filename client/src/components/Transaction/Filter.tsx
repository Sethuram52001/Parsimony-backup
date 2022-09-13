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

const Filter = () => {
  type dateFormatsType = {
    [key: string]: string;
  };

  const dateFormats: dateFormatsType = {
    Today: 'MMM DD',
    'This month': 'MMMM',
    'This year': 'YYYY',
  };

  const currentDate = moment();
  const [timePeriod, setTimePeriod] = useState('Today');
  const [selectedTime, setSelectedTime] = useState(
    moment().format(dateFormats[timePeriod])
  );

  const handleChange = (event: SelectChangeEvent) => {
    const timeSpan = event.target.value;
    setTimePeriod(timeSpan as string);
    setSelectedTime(moment().format(dateFormats[timeSpan]));
  };

  const decreaseTimePeriod = () => {
    let newSelectedTime = moment(selectedTime);
    if (timePeriod === 'Today') {
      newSelectedTime.subtract(1, 'days');
    } else if (timePeriod === 'This month') {
      const month: number = +moment().month(selectedTime).format('M') - 1;
      newSelectedTime = moment().set('month', month);
      newSelectedTime.subtract(1, 'months');
    } else {
      newSelectedTime.subtract(1, 'years');
    }
    setSelectedTime(newSelectedTime.format(dateFormats[timePeriod]));
  };

  const increaseTimePeriod = () => {
    let newSelectedTime = moment(selectedTime);
    if (timePeriod === 'Today') {
      newSelectedTime.add(1, 'days');
    } else if (timePeriod === 'This month') {
      const month: number = +moment().month(selectedTime).format('M') - 1;
      newSelectedTime = moment().set('month', month);
      newSelectedTime.add(1, 'months');
    } else {
      newSelectedTime.add(1, 'years');
    }
    setSelectedTime(newSelectedTime.format(dateFormats[timePeriod]));
  };

  console.log(currentDate);

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
