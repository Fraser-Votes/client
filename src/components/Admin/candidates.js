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
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter
} from "@chakra-ui/core"
import Layout from "../Layout/index"
import firebase from "gatsby-plugin-firebase"
import { IsDesktop, IsMobile } from "../../utils/mediaQueries"
import PlaceholderImage from "../../images/placeholder.jpg"
import AdminSEO from "../adminSEO"

const ToastContext = React.createContext(() => {})
function ToastProvider({ children }) {
  const toast = useToast()
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
}

const Header = ({ title, openDrawer }) => {
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
        onClick={openDrawer}
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
  disabled,
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
        id={field}
        placeholder={placeholder}
        isDisabled={disabled}
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
  isUpdating,
}) => {
  let photoForm = new FormData()

  const [activeField, setActiveField] = React.useState("")
  const profilePictureInputRef = React.useRef(null)
  const [deleteConfirmPopoverOpen, setDeleteConfirmPopoverOpen] = React.useState(false)
  const [newPhoto, setNewPhoto] = React.useState(false)

  const [drawerState, setDrawerState] = React.useState({
    first: candidate?.first,
    last: candidate?.last,
    grade: candidate?.grade,
    position: candidate?.position.id,
    email: candidate?.email,
    instagram: candidate?.instagram,
    snapchat: candidate?.snapchat,
    facebook: candidate?.facebook,
    bio: candidate?.bio,
    videoURL: candidate?.videoURL,
    photoURL: candidate?.photoURL,
    photoFileObject: null,
    id: candidate.id
  })

  const isRequired = ['first', 'last', 'grade', 'position', 'email', 'bio', 'videoURL']

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
      facebook: candidate.facebook,
      bio: candidate.bio,
      videoURL: candidate.videoURL,
      photoURL: candidate.photoURL,
      photoFileObject: null,
      id: candidate.id
    })
    setDeleteConfirmPopoverOpen(false)
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
    setNewPhoto(true)
  }

  const validateFields = () => {
    for (var i = 0; i < isRequired.length; i++) {
      if (!drawerState[isRequired[i]]) {
        return false
      }
    }
    return true
  }

  return (
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
              field="facebook"
              placeholder="Facebook"
              value={drawerState.facebook}
              label="Facebook"
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
              placeholder="Youtube Link"
              helper="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              value={drawerState.videoURL}
              label="Youtube Link"
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
          <Popover
            isOpen={deleteConfirmPopoverOpen}
            onClose={() => setDeleteConfirmPopoverOpen(false)}
            closeOnBlur={true}
          >
            <PopoverTrigger>
              <Button
                px="18px"
                py="10px"
                borderRadius="8px"
                variantColor="red"
                mr="18px"
                isLoading={isDeleting}
                onClick={() => setDeleteConfirmPopoverOpen(true)}
              >
                Delete
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              borderRadius="8px"
            >
              <PopoverHeader border="0" fontWeight="bold" color="blue.900">
                Confirm Deletion
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                Are you sure you want to delete {drawerState.first} {drawerState.last}? This action can't be undone.
              </PopoverBody>
              <PopoverFooter border="0">
                <Button
                  px="18px"
                  py="10px"
                  borderRadius="8px"  
                  mr="18px"      
                  onClick={() => setDeleteConfirmPopoverOpen(false)}        
                >
                  Cancel
                </Button>
                <Button 
                  px="18px"
                  py="10px"
                  borderRadius="8px"                    
                  variantColor="red"
                  onClick={() => deleteCandidate(position, index, toast)}
                >
                  Delete
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => {
              if (validateFields()) {
                updateCandidate(position, index, toast, drawerState, newPhoto)
              } else {
                toast({
                  title: 'Missing fields',
                  description: 'Please fill out all the required fields',
                  status: 'error',
                  duration: '7500',
                  isClosable: true
                })
              }
            }}
            px="18px"
            py="10px"
            borderRadius="8px"
            variantColor="teal"
            isLoading={isUpdating}
          >
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const AddCandidateDrawer = ({
  isOpen,
  onClose,
  addCandidate,
  toast,
  isAdding
}) => {
  let photoForm = new FormData()

  const [activeField, setActiveField] = React.useState("")
  const profilePictureInputRef = React.useRef(null)
  const [newPhoto, setNewPhoto] = React.useState(false)

  const [drawerState, setDrawerState] = React.useState({
    first: undefined,
    last: undefined,
    grade: 9,
    position: "president",
    email: undefined,
    instagram: undefined,
    snapchat: undefined,
    facebook: undefined,
    bio: undefined,
    videoURL: undefined,
    photoURL: undefined,
    photoFileObject: null,
  })
  

  const isRequired = ['first', 'last', 'grade', 'position', 'email', 'bio', 'videoURL']

  useEffect(() => {
    setDrawerState({
      first: undefined,
      last: undefined,
      grade: 9,
      position: "president",
      email: undefined,
      instagram: undefined,
      snapchat: undefined,
      facebook: undefined,
      bio: undefined,
      videoURL: undefined,
      photoURL: undefined,
      photoFileObject: null,
    })
  }, [isOpen])

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
    setNewPhoto(true)
  }

  const validateFields = () => {
    for (var i = 0; i < isRequired.length; i++) {
      if (!drawerState[isRequired[i]]) {
        return false
      }
    }
    return true
  }

  return (
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
          Add Candidate
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
              field="facebook"
              placeholder="Facebook"
              value={drawerState.facebook}
              label="Facebook"
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
              helper="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              placeholder="Youtube Link"
              value={drawerState.videoURL}
              label="Youtube Link"
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
            onClick={() => {
              if (validateFields()) {
                addCandidate(drawerState, toast, newPhoto)
              } else {
                toast({
                  title: 'Missing fields',
                  description: 'Please fill out all the required fields',
                  status: 'error',
                  duration: '7500',
                  isClosable: true
                })
              }
            }}
            px="18px"
            py="10px"
            borderRadius="8px"
            variantColor="teal"
            isLoading={isAdding}
          >
            Add
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
      activePosition: "president",
      activeIndex: 0,
      isDeleting: false,
      isUpdating: false,
      isAddCandidateDrawerOpen: false,
      isAdding: false,
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
        <Header admin={true} title="Candidates" openDrawer={() => this.setState({isAddCandidateDrawerOpen: true})}/>
        <AdminSEO title="Candidates"/>
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
                  <>
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
                    isUpdating={this.state.isUpdating}
                  />
                  <AddCandidateDrawer
                    isOpen={this.state.isAddCandidateDrawerOpen}
                    addCandidate={this.addCandidate}
                    onClose={this.closeAddCandidateDrawer}
                    toast={toast}
                    isAdding={this.state.isAdding}
                  />
                  </>
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

  closeAddCandidateDrawer = () => {
    this.setState({
      isAddCandidateDrawerOpen: false,
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
    let candidateID = this.state.candidates[position][index].id
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

  updateCandidate = async (initialPosition, index, toast, drawerCandidate, newPhoto) => {
    this.setState({
      isUpdating: true
    })
    let position = drawerCandidate.position
    let candidateName = `${this.state.candidates[initialPosition][index].first} ${this.state.candidates[initialPosition][index].last}`
    let candidateID = drawerCandidate.id
    let photoURL = null
    if (newPhoto) {
      photoURL = await this.uploadCandidatePhoto(drawerCandidate.photoFileObject, drawerCandidate.id)
    }
    
    let updateData = {
      first: drawerCandidate.first,
      last: drawerCandidate.last,
      bio: drawerCandidate.bio,
      displayPosition: drawerCandidate.position.replace("-", " ").replace(/\w{3,}/g, (match) => match.replace(/\w/, (m) => m.toUpperCase())),
      email: drawerCandidate.email,
      facebook: drawerCandidate.facebook,
      instagram: drawerCandidate.instagram,
      snapchat: drawerCandidate.snapchat,
      photoURL: newPhoto ? photoURL : drawerCandidate.photoURL,
      grade: drawerCandidate.grade,
      position: firebase.firestore().collection("positions").doc(drawerCandidate.position),
      videoURL: drawerCandidate.videoURL,
      id: drawerCandidate.id
    }

    for (var field in updateData) {
      if (updateData[field] == undefined) {
        delete updateData[field]
      }
    }

    firebase.firestore().collection("candidates").doc(candidateID).update(updateData).then(() => {
      if (initialPosition === position) {
        this.setState(prevState => {
          prevState.candidates[position][index] = updateData
          return {
          isUpdating: false,
          candidates: {
            ...prevState.candidates,
            [position]: prevState.candidates[position]
          }
        }})
      } else {
        this.setState(prevState => {
          prevState.candidates[initialPosition].splice(index, 1)
          prevState.candidates[position].push(updateData)
          return {
          isUpdating: false,
          candidates: {
            ...prevState.candidates,
            [initialPosition]: prevState.candidates[initialPosition].length > 0 ? prevState.candidates[initialPosition] : [],
            [position]: prevState.candidates[position]
          }
        }})
      }
      this.closeDrawer()
      toast({
        title: "Candidate Updated",
        description: `Updated ${candidateName}'s profile`,
        status: 'success',
        duration: 7500,
        isClosable: true
      })
    })
  }

  addCandidate = async (drawerCandidate, toast, newPhoto) => {
    this.setState({
      isAdding: true
    })
    let position = drawerCandidate.position
    let candidateName = `${drawerCandidate.first} ${drawerCandidate.last}`
    let candidateID = drawerCandidate.id
    let photoURL = null
    if (newPhoto) {
      photoURL = await this.uploadCandidatePhoto(drawerCandidate.photoFileObject, drawerCandidate.id)
    }
    
    let updateData = {
      first: drawerCandidate.first,
      last: drawerCandidate.last,
      bio: drawerCandidate.bio,
      displayPosition: drawerCandidate.position.replace("-", " ").replace(/\w{3,}/g, (match) => match.replace(/\w/, (m) => m.toUpperCase())),
      email: drawerCandidate.email,
      facebook: drawerCandidate.facebook,
      instagram: drawerCandidate.instagram,
      snapchat: drawerCandidate.snapchat,
      photoURL: newPhoto ? photoURL : undefined,
      grade: drawerCandidate.grade,
      position: firebase.firestore().collection("positions").doc(drawerCandidate.position),
      videoURL: drawerCandidate.videoURL,
      id: drawerCandidate.id
    }

    for (var field in updateData) {
      if (updateData[field] == undefined) {
        delete updateData[field]
      }
    }

    firebase.firestore().collection("candidates").add(updateData).then((docRef) => {
      this.setState(prevState => {
        prevState.candidates[drawerCandidate.position].push(Object.assign(updateData, {id: docRef.id}))
        return {
            candidates: {
              ...prevState.candidates
            },
            isAdding: false,
            isAddCandidateDrawerOpen: false
        }
      }, () => {
        toast({
          title: "Candidate Added",
          description: `Added ${candidateName}`,
          status: "success",
          duration: 7500,
          isClosable: true
        })
      })
    })

  }

  // returns a firebase storage ref to the photo
  uploadCandidatePhoto = async (photoObj, id) => {
    let refName = `candidates/${id ? id : Date.now()}`
    let childName = id
    try {
      const uploadTask = await firebase.storage().ref(refName).put(photoObj);
      const photoURL = await uploadTask.ref.getDownloadURL()
      return photoURL
    } catch (err) {
      throw new Error(err)
    }

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
                candidates[position.id].push(Object.assign(doc.data(), {id: doc.id}))
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
