import React, { Component, useEffect } from "react"
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
  FormHelperText,
  AspectRatioBox,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from "@chakra-ui/core"
import Layout from "../Layout/index"
import firebase from "gatsby-plugin-firebase"
import { IsDesktop, IsMobile } from "../../utils/mediaQueries"
import PlaceholderImage from "../../images/placeholder.jpg"

const ToastContext = React.createContext(() => {})
function ToastProvider({ children }) {
  const toast = useToast()
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
}

const Header = ({ title, description }) => {
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
      <Text fontSize="2xl" fontWeight="bold" color="blueGray.900">
        {title}
      </Text>
      <Button
        mt="4px"
        borderRadius="8px"
        px="18px"
        py="12px"
        fontSize="14px"
        fontWeight="600"
        variantColor="blue"
      >
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

const CandidateCard = ({
  first,
  last,
  photoURL,
  position,
  index,
  editCandidate,
}) => {
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
      <Text fontWeight="600" fontSize="16px" color="blueGray.700">
        {first} {last}
      </Text>
      <PseudoBox
        ml="auto"
        paddingBottom="2px"
        as="button"
        onClick={() => editCandidate(position, index)}
      >
        <Icon name="edit" size="18px" color="blueGray.700" />
      </PseudoBox>
    </Box>
  )
}

const InputGroup = ({
  placeholder,
  onChange,
  label,
  value,
  required,
  field,
  onFocus,
}) => {
  return (
    <FormControl isRequired={required}>
      <FormLabel fontSize="16px" fontWeight="600" color="blue.900" mb="4px">
        {label}
      </FormLabel>
      <Input
        onFocus={() => onFocus(field)}
        onChange={onChange}
        value={value}
        color="blueGray.700"
        borderRadius="6px"
        borderColor="#D9E2EC"
        fontWeight="600"
        id="fname"
        placeholder={placeholder}
      />
    </FormControl>
  )
}

const CandidateDrawer = ({
  isOpen,
  candidate,
  onClose,
  deleteCandidate,
  updateCandidate,
  position,
  index,
  toast,
  isDeleting,
}) => {
  let photoForm = new FormData()

  const [activeField, setActiveField] = React.useState("")
  const profilePictureInputRef = React.useRef(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState()
  const cancelDeleteDialogRef = React.useRef(null)

  const [drawerState, setDrawerState] = React.useState({
    first: candidate?.first,
    last: candidate?.last,
    grade: candidate?.grade,
    position: candidate?.position.id,
    email: candidate?.email,
    instagram: candidate?.instagram,
    snapchat: candidate?.snapchat,
    twitter: candidate?.twitter,
    bio: candidate?.bio,
    videoURL: candidate?.videoURL,
    photoURL: candidate?.photoURL,
    photoFileObject: null,
  })

  useEffect(() => {
    console.log("effect")
    setDrawerState({
      first: candidate.first,
      last: candidate.last,
      grade: candidate.grade,
      position: candidate.position.id,
      email: candidate.email,
      instagram: candidate.instagram,
      snapchat: candidate.snapchat,
      twitter: candidate.twitter,
      bio: candidate.bio,
      videoURL: candidate.videoURL,
      photoURL: candidate.photoURL,
      photoFileObject: null,
    })
  }, [candidate, isOpen])

  const onFocus = field => {
    setActiveField(field)
  }

  const onChange = event => {
    setDrawerState({
      ...drawerState,
      [activeField]: event.target.value,
    })
  }

  const uploadProfilePhoto = () => {
    profilePictureInputRef.current.click()
  }

  const photoOnChange = e => {
    e.stopPropagation()
    e.preventDefault()
    let file = e.target.files[0]
    photoForm.append("file", file)
    console.log(file)
    setDrawerState({
      ...drawerState,
      photoFileObject: file,
      photoURL: URL.createObjectURL(file),
    })
  }

  const ConfirmDeleteDialog = () => {
    return (
      <AlertDialog
        isOpen={confirmDeleteOpen}
        leastDestructiveRef={cancelDeleteDialogRef}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <AlertDialogContent borderRadius="12px">
          <AlertDialogHeader fontWeight="bold" color="blue.900" fontSize="lg">
            Delete Candidate
          </AlertDialogHeader>
          <AlertDialogBody fontWeight="600" color="blueGray.700">
            Are you sure you want to delete {drawerState.first} {drawerState.last}? This action can't be undone afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button px="18px" py="10px" borderRadius="8px" ref={cancelDeleteDialogRef} onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button px="18px" py="10px" borderRadius="8px" variantColor="red" onClick={() => {setConfirmDeleteOpen(false); deleteCandidate(position, index, toast)}} ml="18px">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose()
        }}
        size={IsDesktop() ? "lg" : "full"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="blue.900" borderBottomWidth="1px">
            Editing: {candidate.first} {candidate.last}
          </DrawerHeader>
          <DrawerBody overflowY="scroll">
            <SimpleGrid
              spacingX="36px"
              spacingY="22px"
              columns={IsDesktop() ? 2 : 1}
            >
              <InputGroup
                onFocus={onFocus}
                onChange={onChange}
                field="first"
                required
                placeholder="First name"
                value={drawerState.first}
                label="First Name"
              />
              <InputGroup
                onFocus={onFocus}
                onChange={onChange}
                field="last"
                required
                placeholder="Last name"
                value={drawerState.last}
                label="Last Name"
              />
              <FormControl isRequired>
                <FormLabel
                  fontSize="16px"
                  fontWeight="600"
                  color="blue.900"
                  mb="4px"
                >
                  Grade
                </FormLabel>
                <Select
                  onChange={onChange}
                  onFocus={() => onFocus("grade")}
                  value={drawerState.grade}
                  fontWeight="600"
                  color="blueGray.700"
                >
                  <option value={9}>9</option>
                  <option value={10}>10</option>
                  <option value={11}>11</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel
                  fontSize="16px"
                  fontWeight="600"
                  color="blue.900"
                  mb="4px"
                >
                  Position
                </FormLabel>
                <Select
                  onChange={onChange}
                  onFocus={() => onFocus("position")}
                  value={drawerState.position}
                  fontWeight="600"
                  color="blueGray.700"
                >
                  <option value="president">President</option>
                  <option value="vice-president">Vice President</option>
                  <option value="secretary">Secretary</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="social-convenor">Social Convenor</option>
                  <option value="communications-manager">
                    Communications Manager
                  </option>
                  <option value="design-manager">Design Manager</option>
                </Select>
              </FormControl>
              <InputGroup
                onFocus={onFocus}
                onChange={onChange}
                field="email"
                required
                placeholder="Email"
                value={drawerState.email}
                label="Email"
              />
              <InputGroup
                onFocus={onFocus}
                onChange={onChange}
                field="instagram"
                placeholder="Instagram"
                value={drawerState.instagram}
                label="Instagram"
              />
              <InputGroup
                onFocus={onFocus}
                onChange={onChange}
                field="snapchat"
                placeholder="Snapchat"
                value={drawerState.snapchat}
                label="Snapchat"
              />
              <InputGroup
                onFocus={onFocus}
                onChange={onChange}
                field="twitter"
                placeholder="Twitter"
                value={drawerState.twitter}
                label="Twitter"
              />
            </SimpleGrid>
            <FormControl isRequired my="22px">
              <FormLabel
                fontSize="16px"
                fontWeight="600"
                color="blue.900"
                mb="4px"
              >
                Bio
              </FormLabel>
              <Textarea
                minHeight="100px"
                fontWeight="600"
                color="blueGray.700"
                borderRadius="8px"
                value={drawerState.bio}
                onChange={onChange}
                onFocus={() => onFocus("bio")}
              />
              <FormHelperText fontWeight="600" color="blueGray.400">
                {drawerState.bio?.length}/240
              </FormHelperText>
            </FormControl>
            <SimpleGrid
              spacingX="36px"
              spacingY="22px"
              columns={IsDesktop() ? 2 : 1}
            >
              <InputGroup
                onFocus={onFocus}
                onChange={onChange}
                field="videoURL"
                required
                placeholder="Video URL"
                value={drawerState.videoURL}
                label="Video URL"
              />
              <FormControl display="flex" flexDirection="column">
                <FormLabel
                  fontSize="16px"
                  fontWeight="600"
                  color="blue.900"
                  mb="4px"
                >
                  Profile Picture
                </FormLabel>
                {drawerState.photoURL ? (
                  <>
                    <AspectRatioBox mb="12px" ratio={1 / 1}>
                      <Image objectFit="cover" src={drawerState.photoURL} />
                    </AspectRatioBox>
                    <input
                      onChange={photoOnChange}
                      type="file"
                      id="profilePictureUpload"
                      ref={profilePictureInputRef}
                      style={{ display: "none" }}
                    />
                    <Button
                      color="blue.900"
                      onClick={uploadProfilePhoto}
                      borderRadius="8px"
                    >
                      Change
                    </Button>
                  </>
                ) : (
                  <>
                    <input
                      onChange={photoOnChange}
                      type="file"
                      id="profilePictureUpload"
                      ref={profilePictureInputRef}
                      style={{ display: "none" }}
                    />
                    <Button
                      color="blue.900"
                      borderRadius="8px"
                      onClick={uploadProfilePhoto}
                    >
                      Upload
                    </Button>
                  </>
                )}
              </FormControl>
            </SimpleGrid>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button
              onClick={onClose}
              color="blue.900"
              px="18px"
              py="10px"
              mr="18px"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setConfirmDeleteOpen(true)}
              px="18px"
              py="10px"
              borderRadius="8px"
              variantColor="red"
              mr="18px"
              isLoading={isDeleting}
            >
              Delete
            </Button>
            <Button
              onClick={() => updateCandidate(position, index, toast)}
              px="18px"
              py="10px"
              borderRadius="8px"
              variantColor="teal"
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <ConfirmDeleteDialog/>
    </>
  )
}

export default class Candidates extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataLoading: true,
      candidates: {},
      isDrawerOpen: false,
      activePosition: "president",
      activeIndex: 0,
      isDeleting: false,
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
                    {this.state["candidates"][position.raw].map(
                      (candidate, index) => {
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
                      }
                    )}
                  </CandidateRow>
                </>
              )
            })}
            <ToastProvider>
              <ToastContext.Consumer>
                {toast => (
                  <CandidateDrawer
                    deleteCandidate={this.deleteCandidate}
                    updateCandidate={this.updateCandidate}
                    position={this.state.activePosition}
                    index={this.state.activeIndex}
                    isOpen={this.state.isDrawerOpen}
                    candidate={
                      this.state.candidates[this.state.activePosition][this.state.activeIndex]
                        ? 
                      this.state.candidates[this.state.activePosition][this.state.activeIndex]
                        : 
                      {
                        first: 'Deleted',
                        last: 'Candidate',
                        grade: "Deleted",
                        position: "Deleted",
                        email: "Deleted"
                      }
                    }
                    onClose={this.closeDrawer}
                    toast={toast}
                    isDeleting={this.state.isDeleting}
                  />
                )}
              </ToastContext.Consumer>
            </ToastProvider>
          </>
        )}
      </Layout>
    )
  }

  closeDrawer = () => {
    this.setState({
      isDrawerOpen: false,
    })
  }

  editCandidate = (activePosition, activeIndex) => {
    this.setState({
      isDrawerOpen: true,
      activePosition: activePosition,
      activeIndex: activeIndex,
    })
  }

  deleteCandidate = async (position, index, toast) => {
    this.setState({
      isDeleting: true
    })
    let candidateName = `${this.state.candidates[position][index].first} ${this.state.candidates[position][index].last}`
    let candidateID = `${this.state.candidates[position][index].first}-${this.state.candidates[position][index].last}`.toLowerCase()
     firebase.firestore().collection("candidates").doc(candidateID).delete()
     .then(() => {
      this.setState(prevState => {
        prevState.candidates[position].splice(index, 1)
        return {
         candidates: {
           ...prevState.candidates,
           [position]: prevState.candidates[position]
         },
         isDeleting: false
        }
       }, () => {
         toast({
           title: "Candidate Deleted",
           description: `Deleted ${candidateName}`,
           status: "success",
           duration: 7500,
           isClosable: true
         })
         this.closeDrawer()
       })
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
