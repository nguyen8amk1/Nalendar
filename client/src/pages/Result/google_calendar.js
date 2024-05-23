import { gapi } from 'gapi-script'
import {moment} from 'moment-timezone';
import { datetime, RRule, RRuleSet, rrulestr } from 'rrule'; 
import axios from 'axios';

const GOOGLE_API_KEY = "AIzaSyCh6uWHq_ISH1bbMgvIbuHsetWx6xhmDFo";

export default class CalendarCreator {
    // byweekday: [RRule.MO, RRule.FR],
    static WEEKDAYS_MAPPING = [
        0, 0, 
        RRule.MO, 
        RRule.TU, 
        RRule.WE, 
        RRule.TH, 
        RRule.FR, 
        RRule.SA, 
        RRule.SU, 
    ];

    constructor() {
        this.accessToken = undefined;
        this.calendarId = 'primary';
        this.timezone = 'Asia/Ho_Chi_Minh';
        this.eventColors = undefined; 
        this.calendarColors = undefined;
    }
    

    getEvents (accessToken) {
    }

    // NOTE: this should be generated from the HTML parser 
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

    setTimeZone(timezone) {
        this.timezone = timezone;
    }

    setCalendarId(id) {
        this.calendarId = id;
    }
    

    _generateDateString(date, time) {
        const months = ["ERROR",  "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December" ];

        var dateArray = date.split('/');

        const newDate = parseInt(dateArray[0], 10); 
        const month = months[parseInt(dateArray[1], 10)];
        const year = parseInt(dateArray[2], 10);

        return `${month} ${newDate}, ${year} ${time} GMT+0700`;
    }

    // NOTE: this function only works correctly is the startdate is monday
    _adjustAsyncWeekdateStateDate(event) {
        const weekday2offsetMapping = [0, 0, 0, 1, 2, 3, 4, 5, 6]; 

        var dateArray = event.startDate.split('/');
        const newDate = parseInt(dateArray[0], 10) + weekday2offsetMapping[event.weekday]; 
        const month = parseInt(dateArray[1], 10);
        const year = parseInt(dateArray[2], 10);

        const newEvent = {
            ...event, 
            startDate: `${newDate}/${month}/${year}`, 
        };

        return newEvent;
    }


    _modifiedSchedule(schedule) {
        const newArray = schedule.map(a => ({...a}));

        for(let i = 0; i < schedule.length; i++) {
            newArray[i] = this._adjustAsyncWeekdateStateDate(schedule[i]);
        }

        return newArray;
    }

    _nextOccuringDate(startDate, gap) {
        let nextStartDate = new Date(startDate); 
        nextStartDate.setDate(nextStartDate.getDate() + gap*7);
        return nextStartDate; 
    }

    _generateDateTimeString(date, time) {
        let result = "";
        const [day, month, year] = date.split('/');

        // NOTE: this full year is only temporary -> change this to a better implementation
        // TODO: create a more dynamic implemetation for this 
        const fullYear= '20'+ year;
        result += fullYear + '-' + month + '-' + day;
        result += 'T'; 
        result += time; 
        result += '+07:00'; 
        return result;
    }


    _eventParse(event) {
        const startCourseDateTime = this._generateDateTimeString(event.startDate, event.startTime);
        const endCourseDateTime = this._generateDateTimeString(event.endDate, event.endTime);
        const [endday, endmonth, endyear] = event.endDate.split('/');

        const startSessionDateTime = this._generateDateTimeString(event.startDate, event.startTime);
        const endSessionDateTime = this._generateDateTimeString(event.startDate, event.endTime);
        
        const courseWeekdays = [CalendarCreator.WEEKDAYS_MAPPING[event.weekday]];
        const interval = event.gap;

        const count = 10;
        const recurrence = new RRule({
            freq: RRule.WEEKLY,
            interval: interval,
            byweekday: courseWeekdays,
            until: datetime('20' + endyear, endmonth, endday),

            //dtstart: datetime(2024, 3, 4, 7, 30, 0),
            //tzid: this.timezone,
            //count: count, 
        }).toString();

        const result = {
            'summary': event.name,
            'description': event.description,

            'start': {
               'dateTime': startSessionDateTime,
               'timeZone': this.timezone,
            },
            
            'end': {
               'dateTime': endSessionDateTime,
               'timeZone': this.timezone,
            },
            
            'recurrence': [recurrence], 
        };

        return result;    
    }

    _stringToIndexInRange(inputString, rangeStart, rangeEnd) {
        /**
     * Converts a string to an index within the specified range.
     * 
     * @param {string} inputString - The input string.
     * @param {number} rangeStart - The starting index of the range (inclusive).
     * @param {number} rangeEnd - The ending index of the range (exclusive).
     * @returns {number} An index within the range [rangeStart, rangeEnd).
     */
        let hash = 0;
        for (let i = 0; i < inputString.length; i++) {
            hash += inputString.charCodeAt(i);
        }
        return rangeStart + (hash % (rangeEnd - rangeStart));
    }

    async enableRandomColors() {
        if(!this.accessToken) {
            throw new Error("Credentials undefined");
        }
        const colors = await this.calendar.colors.get(); 
        this.eventColors = colors.data.event; 
        this.calendarColors = colors.data.calendar;
        //console.log(this.eventColors);
    }

    async createCalendar(calendarName) {
        if(!this.accessToken) {
            throw new Error("Credentials undefined");

        }

        const url = 'https://www.googleapis.com/calendar/v3/calendars';
        const requestData = {
            summary: calendarName, 
            timeZone: "Asia/Ho_Chi_Minh"
        };

        try {
            const response = await axios.post(url, requestData, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const calendarId = response.data.id;
            //console.log('Calendar created successfully:', calendarId);
            return calendarId;
        } catch (error) {
            console.error('Error creating calendar:', error.response.data);
            throw error;
        }

    }

    async createEvent(event) {
        if(!this.accessToken) {
            throw new Error("Credentials undefined");
        }

        // TODO: make this works 
        const validEvent = this._eventParse(event);
        console.log(validEvent);

        const url = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`;

        try {
            const response = await axios.post(url, validEvent, {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            const eventId = response.data.id;
            console.log('Event created successfully:', eventId);
            return eventId;
        } catch (error) {
            console.error('Error creating event:', error.response.data);
            throw error;
        }        

        // await this.calendar.events.insert({
        //     calendarId: this.calendarId,
        //     resource: validEvent,
        //     //colorId: this._stringToIndexInRange(validEvent.summary, 1, this.eventColors.length), 
        //     colorId: '1'
        // }, (err, event) => {
        //     if (err) {
        //         console.log('There was an error contacting the Calendar service: ' + err);
        //         return;
        //     }
        //     console.log('Event created: %s', event.data.summary);
        // });
    }

    async generateResultCalendar(schedule) {
        for(let i = 0; i < schedule.length; i++) {
            const event = schedule[i];
            this.createEvent(event);
        }
    }

    async listEvents(count) {
        if(!this.accessToken) {
            throw new Error("Error: No accessToken");
        }

        let result = "ditme, bi cai lon gi roi"; 
        try {
            const res = await axios.get(
                `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`, 
                {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                }
            );
            const data = res.data;
            console.log("Calendar data: ", data);
            // TODO: do something that get the result 
        } catch (e){
            console.error(e);
        }
        return result;

        //
        // const res = await this.calendar.events.list({
        //     calendarId: this.calendarId,
        //     timeMin: new Date().toISOString(),
        //     maxResults: count,
        //     singleEvents: true,
        //     orderBy: 'startTime',
        // });
        //
        // const events = res.data.items;
        // if (!events || events.length === 0) {
        //     result = 'No upcoming events found.';
        //     // return;
        // } else {
        //     //console.log('Upcoming 10 events:');
        //     result = [];
        //     events.map((event, i) => {
        //         const start = event.start.dateTime || event.start.date;
        //         //console.log(`${start} - ${event.summary}`);
        //         result.push(`${start} - ${event.summary}`);
        //     });
        // }
        // return result;
    }
};