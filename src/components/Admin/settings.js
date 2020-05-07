import React, { Component } from "react"
import { Box, Text, Grid, Switch, useToast, Button, Icon, PseudoBox, IconButton } from "@chakra-ui/core"
import Layout from "../Layout"
import { IsMobile } from "../../utils/mediaQueries"
import AdminSEO from "../adminSEO"
import firebase from "gatsby-plugin-firebase"
import { withPrefix } from "gatsby"
import Helmet from "react-helmet"

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
    >
      <Text fontSize="2xl" fontWeight="bold" color="blueGray.900">
        {title}
      </Text>
    </Box>
  )
}

const SettingHeader = ({ title, description, badge, badgeStatus }) => {
  return (
    <Box mb="16px">
      <Box display="flex" flexDirection="row" alignItems="center" mb="8px">
        <Text fontSize="20px" color="blueGray.900" fontWeight="bold">
          {title}
        </Text>
        { badge ? 
        <Text
          py="3px"
          px="12px"
          ml="12px"
          mt="2px"
          borderRadius="14px"
          backgroundColor={badgeStatus ? "teal.100" : "red.100"}
          color={badgeStatus ? "teal.700" : "red.700"}
          fontWeight="bold"
          fontSize="14px"
        >
          {badge}
        </Text>
        : <></>
        }
      </Box>
      <Text fontWeight="600" fontSize="16px" color="blueGray.400">
        {description}
      </Text>
    </Box>
  )
}

const FileCard = ({name, size, removeKeyFile}) => {
    return (
        <Box
        px="10px"
        py="10px"
        backgroundColor="white"
        border="1.5px solid rgba(217, 226, 236, 0.6)"
        borderRadius="12px"
        maxWidth="300px"
        display="flex"
        flexDirection="row"
        alignItems="center"
        >
            <Icon size="45px" name="document"/>
            <Box
                fontSize="16px"
                fontWeight="600"    
                lineHeight="20px"
                ml="12px"                        
            >
                <Text isTruncated maxWidth="150px" color="blueGray.900">
                    {name}
                </Text>
                <Text color="blueGray.500">
                    {size} bytes
                </Text>
            </Box>
            <PseudoBox as="button" onClick={removeKeyFile} ml="auto">
                <Icon borderRadius="2000px" backgroundColor="blue.50" px="6px" py="6px" size="26px" color="blue.800" name="close"/>
            </PseudoBox>
    </Box>
    )
}

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      votingOpen: false,
      loading: true,
      keyPairExists: false,
      keyFileURL: null,
      privateKey: null,
      fileName: null,
      fileSize: null,
      isCounting: false,
      votes: null
    }
  }

  componentDidMount() {
      this.hydrateWithFirebase()
      this.keyUploadRef = React.createRef(null)
  }

  render() {
    return (
      <Layout>
        <AdminSEO title="Settings" />
        <Header title="Settings" />
        <Helmet>
          <script defer src={withPrefix("../js/openpgp.min.js")}></script>
          <script
            defer
            src={withPrefix("../js/openpgp.worker.min.js")}
          ></script>
        </Helmet>
        <Grid gridTemplateRows="auto fit-content(50%) auto">
          {this.state.loading ? (
            "Loading"
          ) : (
            <ToastProvider>
              <ToastContext.Consumer>
                {toast => (
                  <>
                    <Box mb="32px">
                      <SettingHeader
                        title="Voting"
                        badge={this.state.votingOpen ? "Open" : "Closed"}
                        description="Voting must be closed in order for votes to be counted."
                        badgeStatus={this.state.votingOpen}
                      />
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Switch
                          onChange={e => this.changeVotingOpen(e, toast)}
                          isChecked={this.state.votingOpen}
                          color="teal"
                          size="md"
                        />
                        <Text
                          mt="-4px"
                          ml="12px"
                          color="blueGray.900"
                          fontWeight="600"
                          fontSize="16px"
                        >
                          Open Voting
                        </Text>
                      </Box>
                    </Box>
                    <Box>
                      <SettingHeader
                        title="Count Votes"
                        description="Please upload this election’s private key. This is required in order to decrypt and  count all the ballots."
                      />
                      <input
                        onChange={this.onKeyFileChange}
                        type="file"
                        ref={this.keyUploadRef}
                        accept=".asc"
                        style={{ display: "none" }}
                      />
                      {this.state.privateKey ? (
                          <>
                            <FileCard name={this.state.fileName} size={this.state.fileSize} removeKeyFile={this.removeKeyFile}/>
                            <Text fontWeight="600" fontSize="16px" color="blueGray.400" mt="16px">
                                This process could take several minutes. Please do not leave this webpage.
                            </Text>
                            <Button
                                mt="12px"
                                onClick={this.countVotes}
                                _hover={{ bg: "rgba(220, 238, 251, 0.5);" }}
                                backgroundColor="blue.50"
                                color="blue.800"
                                px="18px"
                                py="12px"
                                borderRadius="8px"
                                isLoading={this.state.isCounting}
                            >
                                Count Votes
                            </Button>
                        </>
                      ) : (
                        <Button
                          onClick={this.uploadKeyFile}
                          _hover={{ bg: "rgba(220, 238, 251, 0.5);" }}
                          backgroundColor="blue.50"
                          color="blue.800"
                          px="18px"
                          py="12px"
                          borderRadius="8px"
                        >
                          Upload Key
                        </Button>
                      )}
                    </Box>
                  </>
                )}
              </ToastContext.Consumer>
            </ToastProvider>
          )}
        </Grid>
      </Layout>
    )
  }

  decrypt = async (encrypted) => {
    let openpgp = window.openpgp
    const privKeyObj = (await openpgp.key.readArmored(this.state.privateKey)).keys[0];
    const options = {
      message: await openpgp.message.readArmored(encrypted),
      privateKeys: [privKeyObj],
    };
  
    let { data } = await openpgp.decrypt(options)
    return data;
  };

  countVotes = async () => {
    this.setState({
      isCounting: true
    })

    let votes = {}

    let db = firebase.firestore()
    try {
      let snapshot = await db.collection("ballots").get()

      // weird workaround to promisify DataSnapshot.forEach
      let promises = []
      snapshot.forEach(doc => {
        for (var key in doc.data().votes) {
          if (doc.data().votes.hasOwnProperty(key)) {
            let vote = doc.data().votes[key];
            promises.push(this.decrypt(vote).then(decryptedVote => {
              if (votes[key]) {
                if (votes[key][decryptedVote]) {
                  votes[key][decryptedVote]++
                } else {
                  votes[key][decryptedVote] = 1
                }
              } else {
                votes[key] = {}
                votes[key][decryptedVote] = 1
              }
            }))
          }
        }
      })
      await Promise.all(promises)

      await db.collection("election").doc("results").set(votes)
      this.setState({
        isCounting: false,
        votes: votes
      })
    } catch (err) {
      console.log("Error counting votes:", err)
    }
  }

  removeKeyFile = () => {
      this.keyUploadRef.current.value = null
      this.setState({
          keyFileURL: null,
          fileName: null,
          fileSize: null,
          privateKey: null
      })
  }

  uploadKeyFile = () => {
    this.keyUploadRef.current.click()
  }

  onKeyFileChange = (e) => {
    // prevent default form actions
    e.stopPropagation()
    e.preventDefault()

    // create a new file reader
    const reader = new FileReader()
    let file = e.target.files[0]
    let fileURL = URL.createObjectURL(file)

    reader.onload = (fileLoadedEvent) => {
        let textFromFileLoaded = fileLoadedEvent.target.result
        this.setState({
            privateKey: textFromFileLoaded,
            keyFileURL: fileURL,
            fileName: file.name,
            fileSize: file.size
        })
    }
    
    reader.readAsText(file)
  }

  changeVotingOpen = (e, toast) => {
    let checked = e.target.checked
    firebase
      .firestore()
      .collection("election")
      .doc("voting")
      .update({
        open: checked,
      })
      .then(() => {
        this.setState({
          votingOpen: checked,
        })
      })
      .catch(err => {
        toast({
          title: "Something went wrong with opening voting",
          description: err,
          status: "error",
          duration: 10000,
          isClosable: true,
        })
      })
  }

  hydrateWithFirebase = async () => {
      let db = firebase.firestore()
      
      // get the current voting open state -> apply to switch
      let votingOpenState = await db.collection("election").doc("voting").get()
      votingOpenState = votingOpenState.data().open

      let publicKeyExists = await db.collection("admin").doc("keys").get()
      publicKeyExists = publicKeyExists.exists

      this.setState({
          votingOpen: votingOpenState,
          keyPairExists: publicKeyExists,
          loading: false
      })
  }

}
