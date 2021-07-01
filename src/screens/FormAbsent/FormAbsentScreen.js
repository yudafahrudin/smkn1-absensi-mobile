import React from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from 'react-native';
import { Card, ListItem, Header, Text, Badge, Button, Input, Image, Overlay, ButtonGroup, CheckBox } from 'react-native-elements';
import { submitAbsentParent, getHomeParent } from '../../actions/parent';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DataTable from 'react-native-paper/lib/commonjs/components/DataTable/DataTable';
import DataTableHeader from 'react-native-paper/lib/commonjs/components/DataTable/DataTableHeader';
import DataTableTitle from 'react-native-paper/lib/commonjs/components/DataTable/DataTableTitle';
import DataTableRow from 'react-native-paper/lib/commonjs/components/DataTable/DataTableRow';
import DataTableCell from 'react-native-paper/lib/commonjs/components/DataTable/DataTableCell';
import EmptyText from '../../components/EmptyText';
import moment from 'moment';
import _ from 'lodash';

class FormAbsentScreen extends React.Component {

    state = {
        reasons: 'sakit',
        description: "",
        image: null,
        isOverlay: false,
        checked: [],
        setDayOff: 1,
        selectedIndex: 0,
        imageInformation: null
    }

    componentDidMount = () => {
        this.startingHomeData()
        this.setChecked()
    }

    startingHomeData = async () => {
        const { actions } = this.props;
        await actions.getHomeParent();
    }

    setChecked = () => {
        const { home } = this.props;
        const { absenToday } = home;
        const checked = absenToday.map(val => { return ({ id: val.id, status: false }) });
        this.setState({
            checked
        })
    }

    getColorBadge = (status) => {
        if (status == 'hadir') {
            return 'success';
        }
        if (status == 'sedang berjalan') {
            return 'primary';
        }
        if (status == 'belum di mulai') {
            return 'primary';
        }
        if (status == 'absen') {
            return 'error';
        }
        return 'warning';
    }

    setDayOff = (setDayOff) => {
        this.setState({
            setDayOff
        })
    }

    setReasons = (reason) => {
        this.setState({
            reason
        })
    }

    setDescription = (description) => {
        this.setState({
            description: description
        })
    }

    getPhoto = () => {
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            this.setState({
                image: image.path,
                imageInformation: image
            })
        }).catch(error => {
        })
    }

    getPhotoByCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            freeStyleCropEnabled: true,
        }).then(image => {
            this.setState({
                image: image.path,
                imageInformation: image
            })
        }).catch(error => {
        })
    }

    deletePhoto = () => {
        this.setState({
            image: null,
            imageInformation: null
        })
    }

    setOverlay = () => {
        const { isOverlay } = this.state;
        this.setState({
            isOverlay: !isOverlay
        })
    }

    submitAbsent = async () => {

        const { actions, navigation } = this.props;
        const { reasons, imageInformation, description, checked, setDayOff, selectedIndex } = this.state;

        // const date = new Date();
        let date = moment(new Date()).format('X');
        const dateForLoop = moment(new Date()).format('X');
        const data = new FormData();

        if (checked.filter(val => val.status == true).length > 0) {
            data.append('schedule', JSON.stringify(checked))
        }

        if (selectedIndex > 0) {
            date = [dateForLoop];

            for (let i = 1; i < setDayOff; i++) {
                date.push(
                    moment.unix(dateForLoop).add(i, 'days').format("X")
                )
            }
            data.append('setdayoff', Number(setDayOff));
        }
        data.append('date', JSON.stringify(date));
        data.append('reasons', reasons);
        data.append('description', description);

        if (imageInformation) {
            data.append('foto', {
                uri: Platform.OS === 'ios' ?
                    `file:///${imageInformation.path}` : imageInformation.path,
                type: imageInformation.mime,
                name: 'photo_absention'
            })
        }
        console.log(date);
        this.setOverlay()
        await actions.submitAbsentParent(data).then(async (result) => {
            if (result) {
                const { data } = result;
                const { status, message } = data;
                if (status == 'error') {
                    setTimeout(() => {
                        this.setOverlay()
                        Alert.alert('Error', message)
                    }, 1000)
                } else {
                    this.setOverlay()
                    await actions.getHomeParent();
                    setTimeout(() => {
                        console.log(navigation);
                        navigation.navigate('Main')
                    }, 500);
                }
            }
        });
    }

    returnBadge = (data) => {
        return (<Badge
            badgeStyle={{ padding: 13 }}
            status={this.getColorBadge(data.absenteeism)}
            value={<Text style={{ fontSize: 13, color: 'white' }}>
                {data.absenteeism}
            </Text>}
        />);
    }

    checkMapel = (bool, index, id) => {
        const { checked } = this.state;
        checked[index] = { status: bool, id };
        this.setState({
            checked
        })
    }

    updateIndex(selectedIndex) {
        this.setState({
            selectedIndex
        })
    }

    render() {
        const { reasons, setDayOff, image, isOverlay, checked, selectedIndex } = this.state;
        const { home } = this.props;
        const { absenToday } = home;
        const buttons = ['sehari', 'lebih dari sehari'];

        return (
            <>
                <Header
                    containerStyle={{ backgroundColor: '#3b5998' }}
                    centerComponent={{
                        text: 'FORM ABSENSI',
                        style: { fontSize: 20, fontWeight: 'bold', color: '#fff' }
                    }}
                />
                <Overlay isVisible={isOverlay}>
                    <Text>Mohon Tunggu...</Text>
                </Overlay>
                <ScrollView style={
                    {
                        height: '100%',
                        padding: 5,
                        backgroundColor: '#f0f0f0'
                    }}
                >
                    <View style={{ marginBottom: 50 }}>
                        <Card containerStyle={{ padding: 0, paddingTop: 10, paddingHorizontal: 15 }}>
                            <Card.Title style={{ fontSize: 20, fontWeight: '500' }}>
                                MATA PELAJARAN
                                </Card.Title>
                            <Card.Divider />

                            <Card.FeaturedSubtitle style={{
                                color: 'grey', paddingHorizontal: 25,
                                fontWeight: '500', textAlign: 'center'
                            }}>
                                Pilih/Centang mata pelajaran yang ingin anda ajukan untuk izin
                                </Card.FeaturedSubtitle>
                            <View style={{ paddingBottom: -10 }}>
                                <Text style={{ padding: 10, color: 'grey', textAlign: 'center' }}>Opsi izin harian</Text>
                                <ButtonGroup
                                    onPress={(val) => this.updateIndex(val)}
                                    selectedIndex={selectedIndex}
                                    buttons={buttons}
                                    containerStyle={{ height: 35, marginBottom: 20 }}
                                />
                            </View>
                            {
                                selectedIndex == 0 ? <>
                                    {
                                        !_.isEmpty(absenToday) ? (absenToday.map((l, i) => (
                                            <ListItem key={i} bottomDivider>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ color: '#000', paddingLeft: 35 }}>
                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                                                            {l.subject.name}
                                                        </Text>
                                                    </ListItem.Title>
                                                    <View flexDirection="row" style={{ marginLeft: -10 }}>
                                                        <CheckBox containerStyle={{ padding: 0, justifyContent: 'center' }}
                                                            checked={checked[i] ? checked[i].status : false}
                                                            onPress={() => this.checkMapel(!(checked[i] ? checked[i].status : false), i, l.id)}
                                                        />
                                                        <DataTable style={{ marginLeft: -15 }}>
                                                            <DataTableHeader style={{ borderBottomColor: 'white' }}>
                                                                <DataTableTitle numberOfLines={20}>Status</DataTableTitle>
                                                                <DataTableTitle>Jam mulai - selesai</DataTableTitle>
                                                            </DataTableHeader>
                                                            <DataTableRow style={{ borderBottomColor: 'white' }}>
                                                                <DataTableCell>
                                                                    {this.returnBadge(l)}
                                                                </DataTableCell>
                                                                <DataTableCell>{l.start_at.slice(0, -3)} - {l.end_at.slice(0, -3)}</DataTableCell>
                                                            </DataTableRow>
                                                        </DataTable>
                                                    </View>
                                                </ListItem.Content>
                                            </ListItem>
                                        ))) : (<EmptyText />)
                                    }</> : <>
                                        <Text style={{ padding: 10, color: 'grey' }}>Jumlah Hari</Text>
                                        <View style={{
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            paddingVertical: 10,
                                            // marginHorizontal: 10,
                                            borderColor: 'rgba(110, 120, 170, 1)',
                                            marginBottom: 10,
                                        }}>
                                            <Picker
                                                selectedValue={setDayOff}
                                                style={{
                                                    height: 25,
                                                    width: '100%'
                                                }}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    this.setDayOff(itemValue)
                                                }}>
                                                <Picker.Item label="1 Hari" value="1" />
                                                <Picker.Item label="2 Hari" value="2" />
                                                <Picker.Item label="3 Hari" value="3" />
                                                {/* <Picker.Item label="4 Hari" value="4" />
                                                <Picker.Item label="5 Hari" value="5" /> */}
                                            </Picker>
                                        </View></>
                            }

                            <Text style={{ padding: 10, color: 'grey' }}>Status</Text>
                            <View style={{
                                borderRadius: 20,
                                borderWidth: 1,
                                paddingVertical: 10,
                                // marginHorizontal: 10,
                                borderColor: 'rgba(110, 120, 170, 1)',
                                marginBottom: 10,
                            }}>
                                <Picker
                                    selectedValue={reasons}
                                    style={{
                                        height: 25,
                                        width: '100%'
                                    }}
                                    onValueChange={(itemValue, itemIndex) => {
                                        this.setReasons(itemValue)
                                    }}>
                                    {/* <Picker.Item label="absen" value="absen" /> */}
                                    <Picker.Item label="SAKIT" value="sakit" />
                                    <Picker.Item label="IZIN" value="izin" />
                                    <Picker.Item label="LAINNYA" value="lainnya" />
                                </Picker>
                            </View>
                            {
                                !image ? (
                                    <View style={{
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        height: 300,
                                        borderColor: 'rgba(110, 120, 170, 1)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginVertical: 20
                                    }}>
                                        <Text style={{ fontSize: 20, color: 'rgba(110, 120, 170, 1)', }}>
                                            No Image
                                        </Text>
                                    </View>
                                ) : null
                            }
                            {
                                image ? (<Image
                                    source={{ uri: image }}
                                    style={{ height: 500, marginVertical: 10 }}
                                    PlaceholderContent={<ActivityIndicator />}
                                />) : (<></>)
                            }
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                                {
                                    image ? (<Button title="Hapus" onPress={this.deletePhoto} />) : null
                                }

                                <Button title="Buka galeri" onPress={this.getPhoto} />
                                <Button title="Ambil foto" onPress={this.getPhotoByCamera} />
                            </View>
                            <Input
                                placeholder='Deskripsi'
                                onChangeText={this.setDescription}
                                multiline={true}
                                numberOfLines={5}
                                returnKeyType={"done"}
                            />
                            <Button
                                containerStyle={{ marginTop: 20, marginBottom: 20 }}
                                onPress={() => this.submitAbsent()}
                                title="AJUKAN" />
                        </Card>
                    </View>
                </ScrollView>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    home: _.get(state.parent, 'home'),
    user: _.get(state.session, 'user'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            submitAbsentParent,
            getHomeParent
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(FormAbsentScreen);


