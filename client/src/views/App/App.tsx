import React, { useState } from 'react';
import Select from 'react-select';
import '../../scss/main.scss';
import styles from './App.module.scss';
import { Clipboard, Gift, Heart } from 'react-feather';
import { IGroups } from '../../interfaces/IGroups';
import { ICourses } from '../../interfaces/ICourses';

function App() {
  /**
   * States for all the selectors
   */
  const [selectedGroup, setSelectedGroup] = useState<IGroups>();
  const [selectedCourses, setSelectedCourses] = useState<ICourses[]>([
    { value: 'ma', label: 'Matte' },
    { value: 'fy', label: 'Fysik' },
    { value: 'ke', label: 'Kemi' },
    { value: 'pfy', label: 'Projektkurs Fysik' },
    { value: 'pke', label: 'Projektkurs Kemi' },
    { value: 'pro', label: 'Programmering' },
  ]);
  const [checkedLocation, setCheckedLocation] = useState<boolean>(true);
  const [checkedExam, setCheckedExam] = useState<boolean>(true);
  const [calendarUrl, setCalendarUrl] = useState<string>('');

  /**
   * Group options for react-select component
   * @param {string} value
   * @param {string} label
   */
  const groups: IGroups[] = [
    { value: '1', label: 'Grupp 1' },
    { value: '2', label: 'Grupp 2' },
    { value: '3', label: 'Grupp 3' },
    { value: '4', label: 'Grupp 4' },
    { value: '5', label: 'Grupp 5' },
    { value: '6', label: 'Grupp 6' },
    { value: '7', label: 'Grupp 7' },
    { value: '8', label: 'Grupp 8' },
    { value: '9', label: 'Grupp 9' },
    { value: '10', label: 'Grupp 10' },
  ];

  /**
   * Group options for react-select component
   * @param {string} value    Value used for the option
   * @param {string} label    Value used as display text
   */
  const courses: ICourses[] = [
    { value: 'ma', label: 'Matte' },
    { value: 'fy', label: 'Fysik' },
    { value: 'ke', label: 'Kemi' },
    { value: 'pfy', label: 'Projektkurs Fysik' },
    { value: 'pke', label: 'Projektkurs Kemi' },
    { value: 'pro', label: 'Programmering' },
  ];

  /**
   * Handles the change of the react-select component for the group
   * @param {IGroups | IGroups[] | null} selected§    Value of the selected group
   */
  const handleGroupChange = (selected?: IGroups | IGroups[] | null) => {
    setSelectedGroup(selected as IGroups);
    getIcalLink(selected as IGroups, selectedCourses as ICourses[], checkedLocation as boolean, checkedExam as boolean);
  };

  /**
   * Handles the change of the react-select component for the courses
   * @param {ICourses | ICourses[] | null} selected   Value of the selected course
   */
  const handleCoursesChange = (selected: readonly ICourses[]) => {
    setSelectedCourses(selected as ICourses[]);
    getIcalLink(selectedGroup as IGroups, selected as ICourses[], checkedLocation as boolean, checkedExam as boolean);
  };

  /**
   * Handles the change for the location checkbox
   * @param {boolean} checked   State of the location checkbox
   */
  const handleLocationChecked = (checked: boolean) => {
    setCheckedLocation(checked);
    getIcalLink(selectedGroup as IGroups, selectedCourses as ICourses[], checked as boolean, checkedExam as boolean);
  };

  /**
   * Handles the change for the exam checkbox
   * @param {boolean} checked   State of the exams checkbox
   */
  const handleExamsChecked = (checked: boolean) => {
    setCheckedExam(checked);
    getIcalLink(selectedGroup as IGroups, selectedCourses as ICourses[], checkedLocation as boolean, checked as boolean);
  };

  /**
   * Calls the API to get the .ical link
   * @param {IGroups} group     The selected group
   * @param {ICourses} courses  The selected courses
   * @param {boolean} location  State of location checkbox
   * @param {boolean} exam      State if exams checkbox
   */
  async function getIcalLink(group: IGroups, courses: ICourses[], location: boolean, exam: boolean) {
    if (group && courses && courses.length > 0) {
      const request = {
        group: group.value,
        modLocation: location,
        modExam: exam,
        courses: courses.map((course: ICourses) => course.value),
      };

      fetch('/api/v1/getUrl/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
        .then((response) => response.json())
        // This will later replace the setUrlInput above
        .then((json) => setCalendarUrl(json.url));
    }
  }

  const copyUrlToClipboard = async () => {
    await navigator.clipboard.writeText(calendarUrl);
    alert('Url copied');
  };

  return (
    <div className={styles.app}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>TB Schema | Prenumerera</h2>
          <div>
            <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Välj din TB undergrupp">
              Välj grupp
            </h4>
            <div className={styles.items}>
              <Select className={styles.react_select_container} placeholder="Välj undergrupp" defaultValue={selectedGroup} onChange={handleGroupChange} options={groups} />
            </div>
          </div>
          {selectedGroup && selectedGroup.value && (
            <>
              <div>
                <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Välj de kurser du vill inkludera i schemat">
                  Välj kurser
                </h4>
                <div className={styles.items}>
                  <Select className={styles.react_select_container} isMulti closeMenuOnSelect={false} defaultValue={selectedCourses} onChange={handleCoursesChange} options={courses} />
                </div>
              </div>
              <div>
                <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip='Lägger till "Lindholmen" eller "Johanneberg" i platsfältet" '>
                  Modifikationer
                </h4>
                <div className={[styles.items, styles['items--checkboxes']].join(' ')}>
                  <label className={styles.checkbox}>
                    Förbättra platsfältet
                    <input name="mod1" type="checkbox" onClick={() => handleLocationChecked(!checkedLocation)} checked={checkedLocation} />
                    <span className={styles.checkbox__checkmark} />
                  </label>
                  <label className={styles.checkbox}>
                    Inkludera tentor och anmällan
                    <input name="mod2" type="checkbox" onClick={() => handleExamsChecked(!checkedExam)} checked={checkedExam} />
                    <span className={styles.checkbox__checkmark} />
                  </label>
                </div>
              </div>
              {selectedCourses && selectedCourses.length !== 0 && (
                <div className={styles.calendar_url}>
                  <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Brukar gå att klistra in i de flesta kalender apparna">
                    Kalender URL
                  </h4>
                  <div className={[styles.items, styles['items--calendar_url']].join(' ')}>
                    <button onClick={copyUrlToClipboard} className={styles.calendar_url__primary_button}>
                      <Clipboard size={16} /> Kopiera kalender url
                    </button>
                    <p>OR manually copy the url</p>
                    <input className={styles.calendar_url__url_input} type="text" readOnly={true} value={calendarUrl} />
                  </div>
                </div>
              )}
            </>
          )}
          <div className={styles.credits}>
            <p className={styles.credits__made_with}>
              Made with
              <Heart className={styles['credits__made_with--heart']} size={16} />
              in Gothenburg, Sweden
            </p>
            <p>En slant för arbetet skadar aldrig!</p>
            <a className={styles.credits__paypal} href="https://paypal.me/memgod">
              <Gift size={16} />
              PayPal
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;