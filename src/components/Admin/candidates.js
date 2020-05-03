import React, { Component } from "react"
import {
  Box,
  Grid,
  Text,
  Skeleton,
  Image,
  Icon,
  PseudoBox,
  Drawer,
  Button,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Select,
  Textarea,
  FormHelperText
} from "@chakra-ui/core"
import Layout from "../Layout/index"
import firebase from "gatsby-plugin-firebase"
import { IsDesktop, IsMobile } from "../../utils/mediaQueries"
import PlaceholderImage from "../../images/placeholder.jpg"

const Header = ({title, description}) => {
    return (
        <Box
            mt={IsMobile() ? "46px" : "12px"}
            h="76px"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            mb="4px"  
          >
            <Text
                fontSize="2xl"
                fontWeight="bold"
                color="blueGray.900"
            >
                {title}
            </Text>
            <Button mt="4px" borderRadius="8px" px="18px" py="12px" fontSize="14px" fontWeight="600" variantColor="blue">
                Add Candidate
            </Button>
        </Box>
    )
  }

const CandidateRow = ({ position, children }) => {
  return (
    <Box mb="32px">
      <Text fontSize="xl" fontWeight="bold" color="blueGray.900" mb="18px">
        {position}
      </Text>
      <Grid
        gridTemplateColumns={IsDesktop() ? "repeat(auto-fill, 310px)" : "1fr"}
        gridColumnGap="24px"
        gridRowGap="24px"
      >
        {children}
      </Grid>
    </Box>
  )
}

const CandidateCard = ({ first, last, photoURL, position, index, editCandidate }) => {
  return (
    <Box
      h="60px"
      w="100%"
      backgroundColor="white"
      border="2px solid rgba(217, 226, 236, 0.6)"
      borderRadius="12px"
      px="12px"
      py="10px"
      display="flex"
      flexDirection="row"
      alignItems="center"
    >
      <Image
        borderRadius="12px"
        h="40px"
        w="40px"
        objectFit="cover"
        src={photoURL}
        fallbackSrc={PlaceholderImage}
        mr="20px"
      />
      <Text
        fontWeight="600"
        fontSize="16px"
        color="blueGray.700"
      >
        {first} {last}
      </Text>
      <PseudoBox
        ml="auto"
        paddingBottom="2px"
        as="button"
        onClick={() => editCandidate()}
      >
        <Icon name="edit" size="18px" color="blueGray.700"/>
      </PseudoBox>
    </Box>
  )
}

const InputGroup = ({placeholder, onChange, label, value, required, field, onFocus }) => {
    return (
            <FormControl isRequired={required}>
                <FormLabel fontSize="16px" fontWeight="600" color="blue.900" mb="4px">
                    {label}
                </FormLabel>
                <Input onFocus={() => onFocus(field)} onChange={onChange} value={value} color="blueGray.700" borderRadius="6px" borderColor="#D9E2EC" fontWeight="600" id="fname" placeholder={placeholder} />
            </FormControl>
    )
}

const CandidateDrawer = ({isOpen, candidate, onClose}) => {

    const [activeField, setActiveField] = React.useState("")

    const [drawerState, setDrawerState] = React.useState({
        first: candidate.first,
        last: candidate.last,
        grade: candidate.grade,
        position: candidate.position,
        email: candidate.email,
        instagram: candidate.instagram,
        snapchat: candidate.snapchat,
        twitter: candidate.twitter,
        bio: candidate.bio,
        videoURL: candidate.videoURL,
        photoURL: candidate.photoURL
    })

    const onFocus = (field) => {
        setActiveField(field)
    }

    const onChange = (event) => {
        setDrawerState({
            ...drawerState,
            [activeField]: event.target.value
        })
    }

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            size={IsDesktop() ? "lg" : "full"}
        >
            <DrawerOverlay/>
            <DrawerContent>
                <DrawerCloseButton/>
                <DrawerHeader color="blue.900" borderBottomWidth="1px">
                    Editing: {candidate.first} {candidate.last}
                </DrawerHeader>
                <DrawerBody overflowY="scroll">
                    <SimpleGrid spacingX="36px" spacingY="22px" columns={IsDesktop() ? 2 : 1}>
                        <InputGroup onFocus={onFocus} onChange={onChange} field="first" required placeholder="First name" value={drawerState.first} label="First Name" />
                        <InputGroup onFocus={onFocus} onChange={onChange} field="last" required placeholder="Last name" value={drawerState.last} label="Last Name" />
                        <FormControl isRequired>
                            <FormLabel fontSize="16px" fontWeight="600" color="blue.900" mb="4px">
                                Grade
                            </FormLabel>
                            <Select onChange={onChange} onFocus={() => onFocus("grade")} value={drawerState.grade} placeholder={candidate.grade}
                                fontWeight="600" color="blueGray.700"
                            >
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                            </Select>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel fontSize="16px" fontWeight="600" color="blue.900" mb="4px">
                                Position
                            </FormLabel>
                            <Select onChange={onChange} onFocus={() => onFocus("position")} value={drawerState.position} 
                                fontWeight="600" color="blueGray.700"
                            >
                                <option value="president">President</option>
                                <option value="vice-president">Vice President</option>
                                <option value="secretary">Secretary</option>
                                <option value="treasurer">Treasurer</option>
                                <option value="social-convenor">Social Convenor</option>
                                <option value="communications-manager">Communications Manager</option>
                                <option value="design-manager">Design Manager</option>
                            </Select>
                        </FormControl>
                        <InputGroup onFocus={onFocus} onChange={onChange} field="email" required placeholder="Email" value={drawerState.email} label="Email" />
                        <InputGroup onFocus={onFocus} onChange={onChange} field="instagram" placeholder="Instagram" value={drawerState.instagram} label="Instagram" />
                        <InputGroup onFocus={onFocus} onChange={onChange} field="snapchat" placeholder="Snapchat" value={drawerState.snapchat} label="Snapchat" />
                        <InputGroup onFocus={onFocus} onChange={onChange} field="twitter" placeholder="Twitter" value={drawerState.twitter} label="Twitter" />
                    </SimpleGrid>
                    <FormControl>
                            <FormLabel mt="22px" fontSize="16px" fontWeight="600" color="blue.900" mb="4px">
                                Bio
                            </FormLabel>
                            <Textarea fontWeight="600" color="blueGray.700" value={drawerState.bio} onChange={onChange} onFocus={() => onFocus("bio")}/>
                            <FormHelperText fontWeight="600" color="blueGray.400">
                                max. 240 chars
                            </FormHelperText>
                    </FormControl>
                </DrawerBody>
                <DrawerFooter borderTopWidth="1px">
                    <Button color="blue.900" px="18px" py="10px" mr="18px">
                        Cancel
                    </Button>
                    <Button px="18px" py="10px" borderRadius="8px" variantColor="red" mr="18px">
                        Delete
                    </Button>
                    <Button px="18px" py="10px" borderRadius="8px" variantColor="teal">
                        Save
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default class Candidates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataLoading: true,
      candidates: {},
      isDrawerOpen: false,
      drawerState: {
        first: null,
        last: null,

      },
      positions: [
        // slightly janky - but for now, it works. This will be replaced with a server-side solution later
        { display: "President", raw: "president" },
        { display: "Vice President", raw: "vice-president" },
        { display: "Secretary", raw: "secretary" },
        { display: "Treasurer", raw: "treasurer" },
        { display: "Social Convenor", raw: "social-convenor" },
        { display: "Communications Manager", raw: "communications-manager" },
        { display: "Design Manager", raw: "design-manager" },
      ],
    }
  }

  componentDidMount() {
    this.getCandidates()
  }

  render() {
    return (
      <Layout>
        <Header admin={true} title="Candidates" />
        {this.state.dataLoading ? (
          <>
            <Skeleton
              borderRadius="4px"
              width="180px"
              height="30px"
              marginBottom="24px"
            />
            <Grid
              gridTemplateColumns={
                window.innerWidth > 960 ? "repeat(auto-fill, 310px)" : "1fr"
              }
              gridColumnGap="24px"
              gridRowGap="24px"
            >
              <Skeleton borderRadius="12px" width="100%" height="60px" />
              <Skeleton borderRadius="12px" width="100%" height="60px" />
              <Skeleton
                borderRadius="12px"
                width="100%"
                height="60px"
                marginBottom="24px"
              />
            </Grid>
          </>
        ) : (
          <>
          {this.state.positions.map(position => {
            return (
              <>
                <CandidateRow position={position.display}>
                  {this.state["candidates"][position.raw].map((candidate, index) => {
                    return (
                      <CandidateCard
                        photoURL={candidate.photoURL}
                        first={candidate.first}
                        last={candidate.last}
                        position={position.raw}
                        index={index}
                        editCandidate={this.editCandidate}
                      />
                    )
                  })}
                </CandidateRow>
              </>
            )
          })}
          <CandidateDrawer isOpen={this.state.isDrawerOpen} candidate={this.state.candidates.president[0]} onClose={this.closeDrawer} />
          </>
        )}
      </Layout>
    )
  }

  closeDrawer = () => {
    this.setState({
        isDrawerOpen: false
    })
  }

  editCandidate = () => {
      this.setState({
          isDrawerOpen: true,
          
      })
  }

  getCandidates = async () => {
    const db = firebase.firestore()
    const candidateRef = db.collection("candidates")
    const candidates = {}

    db.collection("positions")
      .get()
      .then(res => {
        res.docs.forEach(position => {
          candidates[position.id] = []
          var positionDocRef = db.collection("positions").doc(position.id)
          candidateRef
            .where("position", "==", positionDocRef)
            .get()
            .then(res => {
              res.forEach(doc => {
                candidates[position.id].push(doc.data())
              })
            })
            .catch(err => console.log(err))
        })
      })
      .then(() => {
        this.setState(
          {
            candidates: candidates,
          },
          () => {
            // pretend this doesn't exist
            setTimeout(() => {
              this.setState({ dataLoading: false })
            }, 700)
          }
        )
      })
    return true
  }
}
