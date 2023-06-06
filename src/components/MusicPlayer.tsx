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
} from 'react-native';
import React, {Component} from 'react';
import SoundPlayer from 'react-native-sound-player';

const {width, height} = Dimensions.get('window');

interface IProps {
  navigation: any;
  route: any;
}
interface IState {
  isDarkMode: any;
  playing: boolean;
}
class MusicPlayer extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isDarkMode: Appearance.getColorScheme() === 'dark' ? true : false,
      playing: false,
    };

    Appearance.addChangeListener(theme => {
      theme.colorScheme === 'dark'
        ? this.setState({isDarkMode: true})
        : this.setState({isDarkMode: false});
    });
  }

  playMusic = (url: any) => {
    try {
      SoundPlayer.pause();
      this.setState({playing: false});
      console.log('Music is stopped');
    } catch (e) {
      Alert.alert('Cannot play the file');
      console.log('cannot play the song file', e);
    }
  };
  pauseMusic = (url: any) => {
    try {
      SoundPlayer.playUrl(url);
      this.setState({playing: true});
      console.log(url);
    } catch (e) {
      Alert.alert('Cannot play the file');
      console.log('cannot play the song file', e);
    }
  };

  render() {
    const data = this.props.route.params;
    return (
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
              <Image
                style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
                source={require('./photos/down.png')}
              />
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
                style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
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
              source={{uri: data.artwork}}
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
              {data.title}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: this.state.isDarkMode ? 'white' : '#1E1E1E',
                paddingBottom: '5%',
              }}>
              {data.artist}
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
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/volume.png')}
            />
            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/shuffle2.png')}
            />
            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/sort.png')}
            />
            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/repeat.png')}
            />
            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/heart.png')}
            />
          </View>
          <View
            style={{
              width: width / 1.2,
              borderTopColor: this.state.isDarkMode ? 'white' : 'black',
              borderLeftColor: this.state.isDarkMode ? '#2F2F2F' : 'white',
              borderRightColor: this.state.isDarkMode ? '#2F2F2F' : 'white',
              borderBottomColor: this.state.isDarkMode ? '#2F2F2F' : 'white',
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
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              paddingTop: '5%',
              paddingBottom: '50%',
            }}>
            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/previous.png')}
            />

            {this.state.playing ? (
              <TouchableHighlight onPress={() => this.playMusic(data.url)}>
                <Image
                  style={{
                    tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E',
                  }}
                  source={require('./photos/pause.png')}
                />
              </TouchableHighlight>
            ) : (
              <Text onPress={() => this.pauseMusic(data.url)}>Play</Text>
            )}

            <Image
              style={{tintColor: this.state.isDarkMode ? 'white' : '#1E1E1E'}}
              source={require('./photos/next.png')}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {},
});

export default MusicPlayer;
