import '@fullcalendar/react/dist/vdom';
import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, Container, DialogTitle, Dialog } from '@mui/material';
// redux
import { useDispatch, useSelector } from '@/redux/store';
import {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
	selectEvent,
	selectRange,
	onOpenModal,
	onCloseModal,
} from '@/redux/slices/calendar';
// routes
import { PATH_DASHBOARD } from '@/routes/paths';
// utils
import { fTimestamp } from '@/utils/formatTime';
// hooks
import useResponsive from '@/hooks/useResponsive';
// components
import Iconify from '@/Components/iconify';
import { useSnackbar } from '@/Components/snackbar';
import CustomBreadcrumbs from '@/Components/custom-breadcrumbs';
import { useSettingsContext } from '@/Components/settings';
import { useDateRangePicker } from '@/Components/date-range-picker';
// sections
import {
	CalendarForm,
	StyledCalendar,
	CalendarToolbar,
	CalendarFilterDrawer,
} from '../../../../sections/@dashboard/calendar';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
	'#00AB55', // theme.palette.primary.main,
	'#1890FF', // theme.palette.info.main,
	'#54D62C', // theme.palette.success.main,
	'#FFC107', // theme.palette.warning.main,
	'#FF4842', // theme.palette.error.main
	'#04297A', // theme.palette.info.darker
	'#7A0C2E', // theme.palette.error.darker
];

export default function CalendarPage () {
	const { enqueueSnackbar } = useSnackbar();

	const { themeStretch } = useSettingsContext();

	const dispatch = useDispatch();

	const isDesktop = useResponsive('up', 'sm');

	const calendarRef = useRef(null);

	const { events, openModal, selectedRange, selectedEventId } = useSelector((state) => state.calendar);

	const selectedEvent = useSelector((state) => {
		const { events, selectedEventId } = state.calendar;

		if (selectedEventId) {
			return events.find((event) => event.id === selectedEventId);
		}

		return null;
	});

	const picker = useDateRangePicker(null, null);

	const [date, setDate] = useState(new Date());

	const [openFilter, setOpenFilter] = useState(false);

	const [filterEventColor, setFilterEventColor] = useState([]);

	const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

	useEffect(() => {
		dispatch(getEvents());
	}, [dispatch]);

	useEffect(() => {
		const calendarEl = calendarRef.current;
		if (calendarEl) {
			const calendarApi = calendarEl.getApi();
			const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
			calendarApi.changeView(newView);
			setView(newView);
		}
	}, [isDesktop]);

	const handleOpenFilter = () => {
		setOpenFilter(true);
	};

	const handleCloseFilter = () => {
		setOpenFilter(false);
	};

	const handleClickToday = () => {
		const calendarEl = calendarRef.current;
		if (calendarEl) {
			const calendarApi = calendarEl.getApi();
			calendarApi.today();
			setDate(calendarApi.getDate());
		}
	};

	const handleChangeView = (newView) => {
		const calendarEl = calendarRef.current;
		if (calendarEl) {
			const calendarApi = calendarEl.getApi();
			calendarApi.changeView(newView);
			setView(newView);
		}
	};

	const handleClickDatePrev = () => {
		const calendarEl = calendarRef.current;
		if (calendarEl) {
			const calendarApi = calendarEl.getApi();
			calendarApi.prev();
			setDate(calendarApi.getDate());
		}
	};

	const handleClickDateNext = () => {
		const calendarEl = calendarRef.current;
		if (calendarEl) {
			const calendarApi = calendarEl.getApi();
			calendarApi.next();
			setDate(calendarApi.getDate());
		}
	};

	const handleSelectRange = (arg) => {
		const calendarEl = calendarRef.current;
		if (calendarEl) {
			const calendarApi = calendarEl.getApi();
			calendarApi.unselect();
		}
		dispatch(
			selectRange({
				start: arg.start,
				end: arg.end,
			})
		);
	};

	const handleSelectEvent = (arg) => {
		dispatch(selectEvent(arg.event.id));
	};

	const handleResizeEvent = async ({ event }) => {
		try {
			dispatch(
				updateEvent(event.id, {
					allDay: event.allDay,
					start: event.start,
					end: event.end,
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	const handleDropEvent = async ({ event }) => {
		try {
			dispatch(
				updateEvent(event.id, {
					allDay: event.allDay,
					start: event.start,
					end: event.end,
				})
			);
		} catch (error) {
			console.error(error);
		}
	};

	const handleOpenModal = () => {
		dispatch(onOpenModal());
	};

	const handleCloseModal = () => {
		dispatch(onCloseModal());
	};

	const handleCreateUpdateEvent = (newEvent) => {
		if (selectedEventId) {
			dispatch(updateEvent(selectedEventId, newEvent));
			enqueueSnackbar('Update success!');
		} else {
			dispatch(createEvent(newEvent));
			enqueueSnackbar('Create success!');
		}
	};

	const handleDeleteEvent = async () => {
		try {
			if (selectedEventId) {
				dispatch(deleteEvent(selectedEventId));
				handleCloseModal();
				enqueueSnackbar('Delete success!');
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleFilterEventColor = (eventColor) => {
		const checked = filterEventColor.includes(eventColor)
			? filterEventColor.filter((value) => value !== eventColor)
			: [...filterEventColor, eventColor];

		setFilterEventColor(checked);
	};

	const dataFiltered = applyFilter({
		inputData: events,
		filterEventColor,
		filterStartDate: picker.startDate,
		filterEndDate: picker.endDate,
		isError: !!picker.isError,
	});

	return (
		<>
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<CustomBreadcrumbs
					heading="Calendar"
					links={[
						{
							name: 'Dashboard',
							href: PATH_DASHBOARD.root,
						},
						{
							name: 'Calendar',
						},
					]}
					moreLink={['https://fullcalendar.io/docs/react']}
					action={
						<Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
							New Event
						</Button>
					}
				/>

				<Card>
					<StyledCalendar>
						<CalendarToolbar
							date={date}
							view={view}
							onNextDate={handleClickDateNext}
							onPrevDate={handleClickDatePrev}
							onToday={handleClickToday}
							onChangeView={handleChangeView}
							onOpenFilter={handleOpenFilter}
						/>
						<FullCalendar
							weekends
							editable
							droppable
							selectable
							allDayMaintainDuration
							eventResizableFromStart
							events={dataFiltered}
							initialEvents={events}
							ref={calendarRef}
							initialDate={date}
							initialView={view}
							dayMaxEventRows={3}
							eventDisplay="block"
							headerToolbar={false}
							select={handleSelectRange}
							eventDrop={handleDropEvent}
							eventClick={handleSelectEvent}
							eventResize={handleResizeEvent}
							height={isDesktop ? 720 : 'auto'}
							plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
						/>
					</StyledCalendar>
				</Card>
			</Container>

			<Dialog fullWidth maxWidth="xs" open={openModal} onClose={handleCloseModal}>
				<DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>

				<CalendarForm
					event={selectedEvent}
					range={selectedRange}
					onCancel={handleCloseModal}
					onCreateUpdateEvent={handleCreateUpdateEvent}
					onDeleteEvent={handleDeleteEvent}
					colorOptions={COLOR_OPTIONS}
				/>
			</Dialog>

			<CalendarFilterDrawer
				events={events}
				picker={picker}
				open={openFilter}
				onClose={handleCloseFilter}
				colorOptions={COLOR_OPTIONS}
				filterEventColor={filterEventColor}
				onFilterEventColor={handleFilterEventColor}
				onResetFilter={() => {
					const { setStartDate, setEndDate } = picker;
					setFilterEventColor([]);
					if (setStartDate && setEndDate) {
						setStartDate(null);
						setEndDate(null);
					}
				}}
				onSelectEvent={(eventId) => {
					if (eventId) {
						handleOpenModal();
						dispatch(selectEvent(eventId));
					}
				}}
			/>
		</>
	);
}

// ----------------------------------------------------------------------

function applyFilter ({ inputData, filterEventColor, filterStartDate, filterEndDate, isError }) {
	const stabilizedThis = inputData.map((el, index) => [el, index]);

	inputData = stabilizedThis.map((el) => el[0]);

	if (filterEventColor.length) {
		inputData = inputData.filter((event) => filterEventColor.includes(event.textColor));
	}

	if (filterStartDate && filterEndDate && !isError) {
		inputData = inputData.filter(
			(event) =>
				fTimestamp(event.start) >= fTimestamp(filterStartDate) && fTimestamp(event.end) <= fTimestamp(filterEndDate)
		);
	}

	return inputData;
}
