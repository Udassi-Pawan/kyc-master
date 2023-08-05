import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import { EthrDID } from "ethr-did";
import { ethers } from "ethers";
import { Buffer } from "buffer";
import { useEffect, useRef, useState } from "react";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import {
  Box,
  Input,
  Button,
  Typography,
  Stack,
  Backdrop,
  CircularProgress,
} from "@mui/material";
window.Buffer = Buffer;
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const addr = "0xe24fB10c138B1eB28D146dFD2Bb406FAE55176b4";
const regAddr = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";

const rpcURL =
  "https://polygon-testnet.blastapi.io/2e3e0777-ba8f-4cf1-8f77-2aac489b3274";
// const rpcURL = "https://rpc-mumbai.maticvigil.com/";

const JRPCprovider = new ethers.providers.JsonRpcProvider(rpcURL);
const destSigner = new ethers.Wallet(process.env.REACT_APP_PK!, JRPCprovider);

const providerConfig = {
  rpcUrl: rpcURL,
  registry: regAddr,
  chainId: "0x13881",
};
let provider;
const ethrDidResolver = getResolver(providerConfig);
// const didResolver = new Resolver(ethrDidResolver);
// let accounts: string;

function GetJwt() {
  const [dialogueText, setDialogueText] = useState("");
  const handleClose = () => {
    setDialogueText("");
  };
  const [loading, setLoading] = useState<boolean | null>(null);
  const name = useRef<HTMLInputElement>(null);
  const birth = useRef<HTMLInputElement>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [acc, setAcc] = useState<string | null>(null);
  useEffect(() => {
    (async function () {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      setAcc((await provider.listAccounts())[0]);
    })();
  }, []);
  const clickHandler = async () => {
    if (!name.current!.value || !birth.current!.value)
      return setDialogueText("Please provide your name and Date of Birth");
    setLoading(true);
    const ethrDid = new EthrDID({
      identifier: addr,
      chainNameOrId: "0x13881",
      provider: JRPCprovider,
      txSigner: destSigner,
      alg: "ES256K",
    });
    // console.log(addr);
    console.log(ethrDid);

    const { kp, txHash } = await ethrDid.createSigningDelegate();
    const creditScore = Math.floor(Math.random() * 30 + 70);
    console.log(creditScore);
    const helloJWT = await ethrDid.signJWT({
      name: name.current!.value,
      birth: new Date(birth.current!.value).getTime(),
      creditScore,
      address: acc,
    });
    setJwt(helloJWT);
    console.log(helloJWT);
    setLoading(false);
  };

  return (
    <Box>
      <Box>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading!}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog
          open={dialogueText != ""}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Alert."}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {dialogueText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Ok</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Stack alignItems={"center"} mt={5} spacing={3}>
        <Typography
          textAlign={"center"}
          fontFamily={"Abril Fatface"}
          variant="h1"
        >
          KYC MASTER
        </Typography>
        <Typography variant={"h6"} fontFamily={"Roboto"}>
          Get your authenticated identity and credit score now.
        </Typography>

        <Typography textAlign={"center"} variant={"h6"} fontFamily={"Roboto"}>
          Copy the generated KYC pass and submit it at the{" "}
          <a
            target="_blank"
            href="https://exchange-jy9p.onrender.com/centralised/kyc"
          >
            {" "}
            exchange{" "}
          </a>{" "}
          to unlock authenticated features.
        </Typography>
        <Stack spacing={2} direction={"row"} alignItems={"center"}>
          <Input inputRef={name} placeholder="name"></Input>
          <Input type="date" inputRef={birth}></Input>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#254390" }}
            onClick={clickHandler}
          >
            Generate JWT
          </Button>
        </Stack>
        <Typography maxWidth={"90%"} whiteSpace={"normal"} textAlign={"left"}>
          {jwt}
        </Typography>
      </Stack>
    </Box>
  );
}

export default GetJwt;
