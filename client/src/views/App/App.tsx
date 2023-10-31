import { useState, useEffect } from 'react';
import Select from 'react-select';
import '../../scss/main.scss';
import styles from './App.module.scss';
import { Clipboard, Gift, Heart } from 'react-feather';
import { Apple } from '../../assets/svgs/apple';
import { IGroups } from '../../interfaces/IGroups';
import { ICourses } from '../../interfaces/ICourses';

function App() {
  /**
   * States for all the selectors
   */
  const [selectedGroup, setSelectedGroup] = useState<IGroups>();
  const [selectedCourses, setSelectedCourses] = useState<ICourses[]>([
    { value: 'EDA452', label: 'Grundläggande datorteknik' },
    { value: 'TDA555', label: 'Intro till funktionell programmering' },
    { value: 'TMV211', label: 'Inledande diskret matematik' },
    { value: 'DAT044', label: 'Intro till OOP' }
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
    { value: 'A', label: 'Grupp A' },
    { value: 'B', label: 'Grupp B' },
    { value: 'C', label: 'Grupp C' },
    { value: 'D', label: 'Grupp D' },
    { value: 'E', label: 'Grupp E' },
    { value: 'F', label: 'Grupp F' },
    { value: 'G', label: 'Grupp G' }
  ];

  /**
   * Group options for react-select component
   * @param {string} value    Value used for the option
   * @param {string} label    Value used as display text
   */
  const courses: ICourses[] = [
    { value: 'EDA452', label: 'Grundläggande datorteknik' },
    { value: 'TDA555', label: 'Intro till funktionell programmering' },
    { value: 'TMV211', label: 'Inledande diskret matematik' },
    { value: 'DAT044', label: 'Intro till OOP' }
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

  /**
   * Handles the copy to clipboard functionality
   */
  const copyUrlToClipboard = async () => {
    await navigator.clipboard.writeText(calendarUrl);
    alert('Kopierat till urklipp');
  };

  /**
   * Converts the calendar url to a calender link
   */
  let webCalUrl = calendarUrl.replace(/https/gi, 'webcal');

  /**
   * Runs at start and sets the .ical link
   */
  useEffect(() => {
    getIcalLink(selectedGroup as IGroups, selectedCourses as ICourses[], checkedLocation as boolean, checkedExam as boolean);
  }, []);

  return (
    <div className={styles.app}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>DSchema-1 | Prenumerera</h2>
          <div>
            <h4 className={[styles.subtitle, styles.tooltip].join(' ')} data-tooltip="Välj din GruDat undergrupp">
              Välj grupp
            </h4>
            <div className={styles.items}>
              <Select className={styles.react_select_container} placeholder="Välj GruDat undergrupp" defaultValue={selectedGroup} onChange={handleGroupChange} options={groups} />
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
                <h4 className={[styles.subtitle, styles.tooltip].join(' ')}>
                  Modifikationer
                </h4>
                <div className={[styles.items, styles['items--checkboxes']].join(' ')}>
                  <label className={styles.checkbox}>
                    Förbättra titlar
                    <input name="mod1" type="checkbox" onChange={() => handleLocationChecked(!checkedLocation)} checked={checkedLocation} />
                    <span className={styles.checkbox__checkmark} />
                  </label>
                  <label className={styles.checkbox}>
                    Inkludera tentor och anmälan
                    <input name="mod2" type="checkbox" onChange={() => handleExamsChecked(!checkedExam)} checked={checkedExam} />
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
                    <a href={webCalUrl} target={'_blank'} className={styles.calendar_url__primary_button}>
                      <Apple /> Prenumerera på kalender
                    </a>
                    <p>Eller kopiera kalender länk</p>
                    <button onClick={copyUrlToClipboard} className={styles.calendar_url__secondary_button}>
                      <Clipboard size={16} /> Kopiera kalender url
                    </button>
                    <p>Eller kopiera manuellt</p>
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
              in Gothenburg, Sweden by: Whupper & PEZ
            </p>
            <p>En slant för arbetet skadar aldrig!</p>
            <a className={styles.credits__paypal} href="https://paypal.me/memgod">
              <Gift size={16} />
              PayPal
            </a>
            <p>DISCLAIMER: Vi tar ej ansvar för missade lektioner och tentor orsakade av eventuella buggar på denna sidan.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;