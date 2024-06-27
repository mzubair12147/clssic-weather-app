import react from "react";

class App extends react.Component {
  // class fields (js features and not a react feature)
  state = {
    location: "",
    loading: false,
    displayLocation: "",
    weather: {},
  };

  // closest: useEffect with []
  componentDidMount() {
    this.setState({ location: localStorage.getItem("location") || "" });
  }

  // react gives it access to previous state and props
  // closest: useEffect[location]
  componentDidUpdate(prevProps, prevState) {
    if (this.state.location !== prevState.location) {
      this.getWeather();
      localStorage.setItem("location", this.state.location);
    }
  }

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     location: "lisbon",
  //     loading: false,
  //     displayLocation: "",
  //     weather: {},
  //   };
  // }

  // getWeather function as a class field.
  // the arrow functoins do not have their own this keyword. so they get access to their surrounding this keyword and not of theirself.
  getWeather = async () => {
    if (this.state.location.length < 1) return this.setState({ weather: {} });

    try {
      this.setState({ loading: true });
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      });

      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  };

  // async getWeather() {
  //   try {
  //     this.setState({ loading: true });
  //     // 1) Getting location (geocoding)
  //     const geoRes = await fetch(
  //       `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
  //     );
  //     const geoData = await geoRes.json();
  //     console.log(geoData);

  //     if (!geoData.results) throw new Error("Location not found");

  //     const { latitude, longitude, timezone, name, country_code } =
  //       geoData.results.at(0);
  //     this.setState({
  //       displayLocation: `${name} ${convertToFlag(country_code)}`,
  //     });

  //     // 2) Getting actual weather
  //     const weatherRes = await fetch(
  //       `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
  //     );
  //     const weatherData = await weatherRes.json();
  //     this.setState({ weather: weatherData.daily });
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     this.setState({ loading: false });
  //   }
  // }

  setLocation = (e) => {
    return this.setState({ location: e.target.value });
  };

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <div>
          <Input
            location={this.state.location}
            onChangeLocation={this.setLocation}
          />
        </div>

        {this.state.loading && <p className="loader">Loading...</p>}

        {this.state.weather.weathercode && (
          <WeatherItem
            weather={this.state.weather}
            location={this.state.displayLocation}
          />
        )}
      </div>
    );
  }
}

class Input extends react.Component {
  render() {
    const { location, onChangeLocation } = this.props;
    return (
      <input
        type="text"
        value={location}
        placeholder="search for location"
        onChange={onChangeLocation}
      />
    );
  }
}

class WeatherItem extends react.Component {
  render() {
    const {
      temperature_2m_max: max,
      temperature_2m_min: min,
      time: dates,
      weathercode: codes,
    } = this.props.weather;
    return (
      <div>
        <h2>Weather {this.props.location}</h2>
        <ul className="weather">
          {dates.map((date, i) => (
            <Day
              date={date}
              min={min.at(i)}
              max={max.at(i)}
              code={codes.at(i)}
              idToday={i === 0}
              key={date}
            />
          ))}
        </ul>
      </div>
    );
  }
}

class Day extends react.Component {
  render() {
    const { date, max, min, code, isToday } = this.props;
    return (
      <li className="day">
        <span>{getWeatherIcon(code)}</span>
        <p>{isToday ? "Today" : formatDay(date)}</p>
        <p>
          {Math.floor(min)}&deg; &mdash; {Math.ceil(max)}&deg;
        </p>
      </li>
    );
  }
}

export default App;

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

// class Counter extends react.Component {
//   constructor(props) {
//     super(props);

//     this.state = { count: 10 };
//     this.handleDecrement = this.handleDecrement.bind(this);
//     this.handleIncrement = this.handleIncrement.bind(this);
//   }

//   handleDecrement() {
//     this.setState((currState) => {
//       return { ...currState, count: this.state.count - 1 };
//     });
//   }

//   handleIncrement() {
//     this.setState((currState) => {
//       return { ...currState, count: this.state.count + 1 };
//     });
//   }

//   render() {
//     const date = new Date();
//     return (
//       <div>
//         <button onClick={this.handleDecrement}>-</button>
//         <span>{this.state.count}</span>
//         <button onClick={this.handleIncrement}>+</button>
//       </div>
//     );
//   }
// }
