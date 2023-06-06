import {
  Text,
  View,
  Appearance,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert,
  Modal,
} from 'react-native';
import React, {Component} from 'react';
import SoundPlayer from 'react-native-sound-player';
import Slider from '@react-native-community/slider';

import data from '../components/data.js';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
  useProgress,
} from 'react-native-track-player';

const {width, height} = Dimensions.get('window');

interface IProps {
  navigation: any;
}
interface IState {
  isDarkMode: any;
  index: number;
  playing: boolean;
  modalVisible: boolean;
  time: number;
  secs: number;
  trackArtwork: string;
  trackTitle: string;
  trackArtist: string;
  duration: number;
  progress: number;
}
class Home extends Component<IProps, IState> {
  progressInterval: number | undefined;
  constructor(props: any) {
    super(props);
    this.state = {
      isDarkMode: Appearance.getColorScheme() === 'dark' ? true : false,
      index: 0,
      playing: false,
      modalVisible: false,
      time: 0,
      secs: 0,
      trackArtwork: '',
      trackTitle: '',
      trackArtist: '',
      duration: 0,
      progress: 0,
    };

    Appearance.addChangeListener(theme => {
      theme.colorScheme === 'dark'
        ? this.setState({isDarkMode: true})
        : this.setState({isDarkMode: false});
    });
  }
  //   async componentDidMount(): Promise<void> {
  //     await TrackPlayer.setupPlayer();
  //   }

  async componentDidMount(): Promise<void> {
    try {
      await TrackPlayer.setupPlayer().then(() => {
        TrackPlayer.add(data);

        TrackPlayer.addEventListener(
          Event.PlaybackTrackChanged,
          this.onTrackChange,
        );
      });
      await TrackPlayer.getDuration().then(duration =>
        this.setState({duration: duration}),
      );
      await TrackPlayer.setRepeatMode(RepeatMode.Queue);

      await TrackPlayer.setRepeatMode(RepeatMode.Queue);

      this.progressInterval = setInterval(this.getProgress, 1000);
    } catch (error) {
      console.log(error, 'error');
    }
  }
  onTrackChange = async (music: {nextTrack: number}) => {
    console.log(music, `data is ${data[music.nextTrack].artist}`);
    const {artwork, artist, title, duration} = await data[music.nextTrack];
    this.setState({
      trackArtwork: artwork,
      trackTitle: title,
      trackArtist: artist,
      duration: duration,
      progress: 0,
    });
  };
  getProgress = async () => {
    const position = await TrackPlayer.getPosition();
    this.setState({progress: position});
  };

  onSliderValueChange = async (value: number) => {
    await TrackPlayer.seekTo(value);
    this.setState({progress: value});
  };

  //   async getInfo() {
  //     // You need the keyword `async`
  //     try {
  //       const info = await SoundPlayer.getInfo(); // Also, you need to await this because it is async
  //       console.log('getInfo', info); // {duration: 12.416, currentTime: 7.691}
  //       let mins = (info.currentTime / 60).toString().padStart(2, '0');
  //       let secs = (Math.trunc(info.duration) % 60).toString().padStart(2, '0');
  //       this.setState({time: parseInt(mins), secs: parseInt(secs)});
  //       console.log(mins, secs);
  //     } catch (e) {
  //       console.log('There is no song playing', e);
  //     }
  //   }
  //   handlePrevious = (url: any) => {
  //     if (this.state.index !== 0) {
  //       this.setState({index: this.state.index - 1});
  //       try {
  //         SoundPlayer.playUrl(url);
  //         this.setState({playing: true});
  //         console.log(url);
  //       } catch (e) {
  //         Alert.alert('Cannot play the file');
  //         console.log('cannot play the song file', e);
  //       }
  //     }
  //     this.getInfo();
  //   };
  handlePrevious = async () => {
    if (this.state.index !== 0) {
      this.setState({index: this.state.index - 1});
    }
    const currentplay = await TrackPlayer.getPosition();
    if (currentplay < 10) {
      await TrackPlayer.skipToPrevious();
    } else {
      await TrackPlayer.seekTo(0);
    }
  };
  //   handleNext = (url: any) => {
  //     this.setState({index: this.state.index + 1});
  //     try {
  //       SoundPlayer.playUrl(url);
  //       this.setState({playing: true});
  //       console.log(url);
  //     } catch (e) {
  //       Alert.alert('Cannot play the file');
  //       console.log('cannot play the song file', e);
  //     }
  //     this.getInfo();
  //   };

  handleNext = async () => {
    await TrackPlayer.skipToNext();
    this.setState({index: this.state.index + 1});
  };

  //   playMusic = (url: any) => {
  //     try {
  //       SoundPlayer.pause();
  //       this.setState({playing: false});
  //       console.log('Music is stopped');
  //     } catch (e) {
  //       Alert.alert('Cannot play the file');
  //       console.log('cannot play the song file', e);
  //     }
  //     this.getInfo();
  //   };
  playMusic = async () => {
    await TrackPlayer.pause();
    this.setState({playing: false});
  };
  //   pauseMusic = (url: any) => {
  //     try {
  //       SoundPlayer.playUrl(url);
  //       this.setState({playing: true});
  //       console.log(url);
  //     } catch (e) {
  //       Alert.alert('Cannot play the file');
  //       console.log('cannot play the song file', e);
  //     }
  //     this.getInfo();
  //   };
  pauseMusic = async () => {
    await TrackPlayer.play();
    this.setState({playing: true});
    console.log(TrackPlayer.getCurrentTrack());
  };
  handleModal = () => {
    this.setState({modalVisible: true});
  };

  renderMusicList = (item: any) => {
    const images = item.artwork;

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          try {
            TrackPlayer.skip(item.id - 1);
            TrackPlayer.play();
            this.setState({playing: true});
            console.log(item.url);
            console.log(item);
          } catch (e) {
            Alert.alert('Cannot play the file');
            console.log('cannot play the song file', e);
          }
          this.setState({index: item.id - 1});
          //   this.props.navigation.navigate('MusicPlayer', {
          //     ...item,
          //   });
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: '3%',
            justifyContent: 'flex-start',
          }}>
          <Image
            resizeMode="cover"
            style={{width: '15%', height: '100%', borderRadius: 6}}
            source={{uri: images}}
          />
          <View style={{paddingLeft: '6%'}}>
            <Text
              style={{
                fontWeight: '700',
                fontSize: 18,
                color: this.state.isDarkMode ? 'white' : '#1E1E1E',
              }}>
              {item.title}
            </Text>
            <Text
              style={{
                fontWeight: '200',
                fontSize: 14,
                color: this.state.isDarkMode ? 'white' : '#1E1E1E',
              }}>
              {item.artist}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  //   renderMusicList = async (index: number) => {
  //     await TrackPlayer.skip(index);
  //   };
  format = (seconds: number) => {
    let mins = (seconds / 60).toString().padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  formatTime = (secs: number) => {
    let minutes = Math.floor(secs / 60);
    let seconds = Math.ceil(secs - minutes * 60);

    if (seconds < 10) {
      seconds = seconds;
    }

    return `${minutes}:${seconds}`;
  };

  render() {
    const selectedData = data[this.state.index];
    const formatprogress = `${Math.floor(this.state.progress / 60)}:${(
      this.state.progress % 60
    )
      .toFixed(0)
      .padStart(2, '0')}`;
    const formatduration = `${Math.floor(this.state.duration / 60)}:${(
      this.state.duration % 60
    )
      .toFixed(0)
      .padStart(2, '0')}`;
    // console.log(formatduration);
    // console.log(formatprogress);
    console.log(this.state.duration, this.state.progress);
    return (
      <SafeAreaView
        style={{backgroundColor: this.state.isDarkMode ? '#1E1E1E' : 'white'}}>
        <View style={styles.mainContainer}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '3%',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
                source={require('./photos/menu.png')}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '800',
                  paddingLeft: '2%',
                  color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                }}>
                {' '}
                Music Player
              </Text>
            </View>
            <View>
              <Image
                style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
                source={require('./photos/searc.png')}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              paddingTop: '4%',
            }}>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Songs
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Artists
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Playlist
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Albums
            </Text>
            <Text style={{color: this.state.isDarkMode ? 'white' : '#1E1E1E'}}>
              Folder
            </Text>
            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/shuffle.png')}
            />
            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/playlist.png')}
            />
          </View>
          <View>
            <FlatList
              data={data}
              renderItem={({item}) => this.renderMusicList(item)}
            />
          </View>
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setState({modalVisible: !this.state.modalVisible});
            }}>
            {/* <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Hello World!</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => this.setState({modalVisible: !this.state.modalVisible})}>
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
              </View>
            </View> */}
            <SafeAreaView
              style={{
                backgroundColor: this.state.isDarkMode ? '#2F2F2F' : 'white',
              }}>
              <View style={styles.mainContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5%',
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableHighlight
                      onPress={() => this.setState({modalVisible: false})}>
                      <Image
                        style={{
                          tintColor: this.state.isDarkMode
                            ? 'white'
                            : '#1E1E1E',
                        }}
                        source={require('./photos/down.png')}
                      />
                    </TouchableHighlight>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '800',
                        paddingLeft: '20%',
                        textAlign: 'center',
                        color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      }}>
                      {' '}
                      Music Player
                    </Text>
                  </View>
                  <View>
                    <Image
                      style={{
                        tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      }}
                      source={require('./photos/settings.png')}
                    />
                  </View>
                </View>
                <View style={{height: height / 2}}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                    }}>
                    Song <Text> / Lyrics</Text>
                  </Text>
                  <Image
                    style={{
                      width: '70%',
                      height: height / 3,
                      borderRadius: 20,
                      marginTop: '12%',
                      alignSelf: 'center',
                    }}
                    source={{uri: selectedData.artwork}}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: '800',
                      color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      paddingBottom: '3%',
                    }}>
                    {selectedData.title}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      paddingBottom: '5%',
                    }}>
                    {selectedData.artist}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingTop: '7%',
                    paddingBottom: '6%',
                  }}>
                  <Image
                    style={{
                      tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                    }}
                    source={require('./photos/volume.png')}
                  />
                  <Image
                    style={{
                      tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                    }}
                    source={require('./photos/shuffle2.png')}
                  />
                  <Image
                    style={{
                      tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                    }}
                    source={require('./photos/sort.png')}
                  />
                  <Image
                    style={{
                      tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                    }}
                    source={require('./photos/repeat.png')}
                  />
                  <Image
                    style={{
                      tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                    }}
                    source={require('./photos/heart.png')}
                  />
                </View>
                {/* <View
                  style={{
                    width: width / 1.2,
                    borderTopColor: this.state.isDarkMode ? 'white' : 'black',
                    borderLeftColor: this.state.isDarkMode
                      ? '#2F2F2F'
                      : 'white',
                    borderRightColor: this.state.isDarkMode
                      ? '#2F2F2F'
                      : 'white',
                    borderBottomColor: this.state.isDarkMode
                      ? '#2F2F2F'
                      : 'white',
                    borderWidth: 3,
                    alignSelf: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '3%',
                    }}>
                    <Text>1:53</Text>
                    <Text>4:42</Text>
                  </View>
                </View> */}
                <Slider
                  style={{width: width, height: 40}}
                  minimumValue={0}
                  maximumValue={this.state.duration}
                  value={this.state.progress}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                  onSlidingComplete={this.onSliderValueChange}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingTop: '5%',
                    paddingBottom: '50%',
                  }}>
                  <TouchableHighlight onPress={() => this.handlePrevious()}>
                    <Image
                      style={{
                        tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      }}
                      source={require('./photos/previous.png')}
                    />
                  </TouchableHighlight>

                  {this.state.playing ? (
                    <TouchableHighlight onPress={() => this.playMusic()}>
                      <Image
                        style={{
                          tintColor: this.state.isDarkMode
                            ? 'white'
                            : '#1E1E1E',
                        }}
                        source={require('./photos/pause.png')}
                      />
                    </TouchableHighlight>
                  ) : (
                    <TouchableHighlight onPress={() => this.pauseMusic()}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          tintColor: 'white',
                        }}
                        source={require('./photos/play.png')}
                      />
                    </TouchableHighlight>
                  )}
                  <TouchableHighlight onPress={() => this.handleNext()}>
                    <Image
                      style={{
                        tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                      }}
                      source={require('./photos/next.png')}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
        <TouchableHighlight
          onPress={this.handleModal}
          style={{
            position: 'absolute',
            bottom: 0,
            flexDirection: 'row',
            backgroundColor: 'black',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width / 2.5,
            paddingBottom: '20%',
            paddingStart: '4%',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              backgroundColor: 'black',
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').width / 2.5,
              paddingBottom: '20%',
              paddingStart: '4%',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                style={{width: '26%', height: '70%', borderRadius: 8}}
                source={{
                  uri: selectedData.artwork,
                }}
              />
              <View style={{paddingLeft: '5%'}}>
                <Text>{selectedData.title}</Text>
                <Text>{selectedData.artist}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableHighlight onPress={() => this.handlePrevious()}>
                <Image
                  style={{tintColor: 'white', marginRight: '10%'}}
                  source={require('./photos/prev2.png')}
                />
              </TouchableHighlight>
              {this.state.playing ? (
                <TouchableHighlight onPress={() => this.playMusic()}>
                  <Image
                    style={{tintColor: 'white', marginRight: '10%'}}
                    source={require('./photos/pause2.png')}
                  />
                </TouchableHighlight>
              ) : (
                <TouchableHighlight onPress={() => this.pauseMusic()}>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      tintColor: 'white',
                      marginRight: '10%',
                    }}
                    source={require('./photos/play.png')}
                  />
                </TouchableHighlight>
              )}
              <TouchableHighlight onPress={() => this.handleNext()}>
                <Image source={require('./photos/next2.png')} />
              </TouchableHighlight>
            </View>
          </View>
        </TouchableHighlight>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {},
});

export default Home;
