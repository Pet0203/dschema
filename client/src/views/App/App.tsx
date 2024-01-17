import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Input,
  Link,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";

import { Apple } from "../../assets/svgs/apple";
import { Clipboard, Heart, PiggyBank } from "lucide-react";

function App() {
  const courses = [
    {
      label: "Inledande diskret matematik",
      value: "TMV211",
      description: "lp1",
    },
    {
      label: "Intro till funktionell programmering",
      value: "TDA555",
      description: "lp1",
    },
    { label: "Intro till OOP", value: "DAT044", description: "lp2" },
    { label: "Grundläggande datorteknik", value: "EDA452", description: "lp2" },
    {
      label: "Maskinorienterad programmering",
      value: "DAT017",
      description: "lp3",
    },
    {
      label: "Linjär algebra",
      value: "TMV216",
      description: "lp3",
    },
  ];

  const grudatGroups = [
    { value: "A", label: "Group A" },
    { value: "B", label: "Group B" },
    { value: "C", label: "Group C" },
    { value: "D", label: "Group D" },
    { value: "E", label: "Group E" },
    { value: "F", label: "Group F" },
    { value: "G", label: "Group G" },
  ];

  const mopGroups = [
    { value: "A", label: "Group A" },
    { value: "B", label: "Group B" },
    { value: "C", label: "Group C" },
    { value: "D", label: "Group D" },
    { value: "E", label: "Group E" },
    { value: "F", label: "Group F" },
    { value: "G", label: "Group G" },
    { value: "H", label: "Group H" },
    { value: "I", label: "Group I" },
  ];

  /**
   * States for all the selectors
   */
  const [selectedCourses, setSelectedCourses] = useState(
    new Set([
      ...courses.map((course) => {
        return course.value;
      }),
    ])
  );
  const [selectedGrudatGroup, setSelectedGrudatGroup] = useState<Set<string>>(
    new Set()
  );
  const [selecteMopGroup, setSelectedMopGroup] = useState<Set<string>>(
    new Set()
  );
  const [checkedLocation, setCheckedLocation] = useState<boolean>(true);
  const [checkedExam, setCheckedExam] = useState<boolean>(true);
  const [checkedUseRetro, setCheckedUseRetro] = useState<boolean>(true);
  const [calendarUrl, setCalendarUrl] = useState<string>("");

  /**
   * Calls the API to get the .ical link
   * @param {string} group     The selected group
   * @param {string[]} courses  The selected courses
   * @param {boolean} location  State of location checkbox
   * @param {boolean} exam      State if exams checkbox
   * @param {boolean} useRetro  State of showing passed events (up to two weeks) checkbox
   */
  async function getIcalLink(
    courses: any,
    location: boolean,
    exam: boolean,
    useRetro: boolean
  ) {
      const request = {
        modLocation: location,
        modExam: exam,
        useRetro: useRetro,
        courses: courses ? courses : [],
      };

      fetch("/api/v1/getUrl/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
        .then((response) => response.json())
        // This will later replace the setUrlInput above
        .then((json) => setCalendarUrl(json.url));
  }

  /**
   * Handles the copy to clipboard functionality
   */
  const copyUrlToClipboard = async () => {
    await navigator.clipboard.writeText(calendarUrl);
    alert("Copied to clipboard!");
  };

  /**
   * Converts the calendar url to a calender link
   */
  let webCalUrl = calendarUrl.replace(/https/gi, "webcal");

  /**
   * Sets the .ical link
   */
  useEffect(() => {
    const theCources = Array.from(selectedCourses);

    const grudatGroup = selectedGrudatGroup.values().next().value;
    const mopGroup = selecteMopGroup.values().next().value;

    const groups = [];

    //Loop through all elements in theCourses, if they have a group, push a new course + group object onto groups, else just push the course name.
    for (let i = 0; i < theCources.length; i++) {
      if (theCources[i] === "EDA452") {
        groups.push({ course: theCources[i], group: grudatGroup});
      } else if (theCources[i] === "DAT017") {
        groups.push({ course: theCources[i], group: mopGroup});
      } else {
        groups.push({course: theCources[i], group: -1});
      }
    }

    console.log(groups);

    getIcalLink(
      groups,
      checkedLocation,
      checkedExam,
      checkedUseRetro
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCourses,
    selectedGrudatGroup,
    selecteMopGroup,
    checkedLocation,
    checkedExam,
    checkedUseRetro,
  ]);

  return (
    <div className="container p-4 mx-auto">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader className="p-6 flex flex-col items-start gap-2">
            <div>
              <h1 className="text-3xl">DSchema</h1>
              <p className="text-foreground-500">by Whupper and PEZ</p>
            </div>
            <p className="text-primary">
              DISCLAIMER! We do not take responsibility for missed lectures and
              exams caused by any bugs on this page.
            </p>
          </CardHeader>
          <Divider />
          <CardBody className="p-6 flex gap-8">
            <Select
              label="Select courses to subscribe to"
              selectionMode="multiple"
              placeholder="Select a course"
              selectedKeys={selectedCourses}
              variant="bordered"
              labelPlacement="outside"
              isMultiline
              onSelectionChange={setSelectedCourses as any}
              classNames={{
                trigger: "min-h-unit-12 py-2",
              }}
              renderValue={() => {
                return (
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedCourses).map((selectedItem) => (
                      <Chip
                        key={selectedItem}
                        className="bg-primary text-primary-foreground"
                      >
                        {
                          courses.find(
                            (course) => course.value === selectedItem
                          )?.label
                        }
                      </Chip>
                    ))}
                  </div>
                );
              }}
            >
              {courses.map((course) => (
                <SelectItem key={course.value} textValue={course.label}>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small font-bold">
                        {course.label}
                      </span>
                      <span className="text-tiny text-default-500">
                        {course.value}-{course.description}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </Select>
            {selectedCourses.has("EDA452") && (
              <Select
                label="Select GruDat lab group"
                placeholder="Select group"
                selectedKeys={selectedGrudatGroup}
                variant="bordered"
                labelPlacement="outside"
                isMultiline
                onSelectionChange={setSelectedGrudatGroup as any}
                classNames={{
                  trigger: "min-h-unit-12 py-2",
                }}
                renderValue={() => {
                  return (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedGrudatGroup).map((selectedItem) => (
                        <Chip
                          key={selectedItem}
                          className="bg-primary text-primary-foreground"
                        >
                          {
                            grudatGroups.find(
                              (group) => group.value === selectedItem
                            )?.label
                          }
                        </Chip>
                      ))}
                    </div>
                  );
                }}
              >
                {grudatGroups.map((group) => (
                  <SelectItem key={group.value} textValue={group.label}>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-small font-bold">
                          {group.label}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            )}
            {selectedCourses.has("DAT017") && (
              <Select
                label="Select Mop group"
                placeholder="Select group"
                selectedKeys={selecteMopGroup}
                variant="bordered"
                labelPlacement="outside"
                isMultiline
                onSelectionChange={setSelectedMopGroup as any}
                classNames={{
                  trigger: "min-h-unit-12 py-2",
                }}
                renderValue={() => {
                  return (
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selecteMopGroup).map((selectedItem) => (
                        <Chip
                          key={selectedItem}
                          className="bg-primary text-primary-foreground"
                        >
                          {
                            mopGroups.find(
                              (group) => group.value === selectedItem
                            )?.label
                          }
                        </Chip>
                      ))}
                    </div>
                  );
                }}
              >
                {mopGroups.map((group) => (
                  <SelectItem key={group.value} textValue={group.label}>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col">
                        <span className="text-small font-bold">
                          {group.label}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            )}
            {
              // If the user has selected EDA452, show options only if the user has selected a group, but if the user has not selected EDA452, show the options
              ((selectedCourses.has("EDA452") && selectedGrudatGroup.size > 0) || !selectedCourses.has("EDA452")) &&
              ((selectedCourses.has("DAT017") && selecteMopGroup.size > 0) || !selectedCourses.has("DAT017"))
                && (
                  <>
                    <div className="group relative flex flex-col w-full transition-background motion-reduce:transition-none !duration-150">
                      <label className="block text-small font-medium pointer-events-none text-foreground pb-1.5 will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none">
                        Modifications
                      </label>
                      <div className="flex flex-col gap-2">
                        <Switch
                          isSelected={checkedLocation}
                          onValueChange={setCheckedLocation}
                        >
                          Improved titles
                        </Switch>
                        <Switch
                          isSelected={checkedExam}
                          onValueChange={setCheckedExam}
                        >
                          Include exams and signups
                        </Switch>
                        <Switch
                          isSelected={checkedUseRetro}
                          onValueChange={setCheckedUseRetro}
                        >
                          Keep passed event (up to two weeks)
                        </Switch>
                      </div>
                    </div>
                    <div className="group relative flex flex-col w-full transition-background motion-reduce:transition-none !duration-150">
                      <label className="text-small font-medium pointer-events-none text-foreground pb-1.5 will-change-auto origin-top-left transition-all !duration-200 !ease-out motion-reduce:transition-none">
                        Calendar URL
                      </label>
                      <div className="flex flex-col gap-2 w-full">
                        <Button
                          color="primary"
                          as={Link}
                          href={webCalUrl}
                          target="_blank"
                        >
                          <Apple />
                          Subscribe to calendar
                        </Button>
                        <p className="text-small mx-auto">or</p>
                        <Button
                          variant="flat"
                          color="primary"
                          onClick={copyUrlToClipboard}
                        >
                          <Clipboard className="w-4 h-4" />
                          Copy calendar URL to clipboard
                        </Button>
                        <p className="text-small mx-auto">or</p>
                        <Input
                          isReadOnly
                          type="text"
                          variant="bordered"
                          labelPlacement="outside"
                          value={calendarUrl}
                        />
                      </div>
                    </div>
                  </>
                )
            }
          </CardBody>
          <Divider />
          <CardFooter className="p-6 flex flex-col items-center gap-2">
            <p className="flex items-center gap-1">
              Made with{" "}
              <Heart className="w-4 h-4 fill-primary text-primary animate-pulse inline" />{" "}
              in Gothenburg, Sweden
            </p>
            <p>A small donation never hurts :)</p>
            <Button
              color="primary"
              variant="flat"
              as={Link}
              href="https://paypal.me/memgod"
              target="_blank"
              className="flex items-center gap-1"
            >
              <PiggyBank className="w-4 h-4 text-primary" />
              Donate using PayPal
            </Button>
            <Link
              isExternal
              href="https://github.com/Pet0203/dschema"
              showAnchorIcon
            >
              Github Repository
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
