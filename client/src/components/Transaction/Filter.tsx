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
import { useAppSelector as useSelector } from '../../hooks/hooks';

const Filter = () => {
  const dispatch = useDispatch();

  type dateFormatsType = {
    [key: string]: string;
  };

  const dateFormats: dateFormatsType = {
    Day: 'MMM DD',
    Month: 'MMMM',
    Year: 'YYYY',
  };

  const timeSpan: string = useSelector((state) => state.filter.timeSpan);
  const [selectedTime, setSelectedTime] = useState(
    moment().format(dateFormats[timeSpan])
  );

  const handleChange = (event: SelectChangeEvent) => {
    let timeSpan = event.target.value;
    setSelectedTime(moment().format(dateFormats[timeSpan]));
    dispatch(filterActions.setTimeSpan(timeSpan as string));
    if (timeSpan === 'Day') {
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
  };

  const decreaseTimePeriod = () => {
    let newSelectedTime = moment(selectedTime);
    if (timeSpan === 'Day') {
      newSelectedTime.subtract(1, 'days');
      dispatch(
        filterActions.setDate(
          newSelectedTime
            .set({ year: +moment().format('YYYY') })
            .format('YYYY-MM-DD') as string
        )
      );
    } else if (timeSpan === 'Month') {
      const month: number = +moment().month(selectedTime).format('M') - 1;
      newSelectedTime = moment().set('month', month);
      newSelectedTime.subtract(1, 'months');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timeSpan]) as string
        )
      );
    } else {
      newSelectedTime.subtract(1, 'years');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timeSpan]) as string
        )
      );
    }
    setSelectedTime(newSelectedTime.format(dateFormats[timeSpan]));
  };

  const increaseTimePeriod = () => {
    let newSelectedTime = moment(selectedTime);
    if (timeSpan === 'Day') {
      newSelectedTime.add(1, 'days');
      dispatch(
        filterActions.setDate(
          newSelectedTime
            .set({ year: +moment().format('YYYY') })
            .format('YYYY-MM-DD') as string
        )
      );
    } else if (timeSpan === 'Month') {
      const month: number = +moment().month(selectedTime).format('M') - 1;
      newSelectedTime = moment().set('month', month);
      newSelectedTime.add(1, 'months');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timeSpan]) as string
        )
      );
    } else {
      newSelectedTime.add(1, 'years');
      dispatch(
        filterActions.setDate(
          newSelectedTime.format(dateFormats[timeSpan]) as string
        )
      );
    }
    setSelectedTime(newSelectedTime.format(dateFormats[timeSpan]));
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
      <Select sx={{ width: '150px' }} value={timeSpan} onChange={handleChange}>
        <MenuItem value={'Day'}>Today</MenuItem>
        <MenuItem value={'Month'}>This month</MenuItem>
        <MenuItem value={'Year'}>This year</MenuItem>
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
