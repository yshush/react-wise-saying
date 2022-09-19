import React, { useEffect, useState } from "react";
import Box from "./components/Box";
import Flex from "./components/Flex";
import {
  VscListUnordered,
  VscArrowLeft,
  VscAdd,
  VscTrash,
  VscEdit,
  VscClose,
  VscCheck,
} from "react-icons/vsc";
import axios from "axios";
import Data from "./interfaces/Data";

axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const [page, setPage] = useState<"main" | "edit">("main");
  const [nowData, setNowData] = useState<null | Data>(null);
  const [dataList, setDataList] = useState<null | Data[]>(null);
  const [error, setError] = useState("");
  const [createMode, setCreateMode] = useState(false);
  const [createInp, setCreateInp] = useState<[string, string]>(["", ""]);
  const [editInp, setEditInp] = useState<[string, string]>(["", ""]);
  const [selectedData, setSelectedData] = useState<string | null>(null);

  useEffect(() => {
    if (page === "main") {
      axios
        .get("/random")
        .then((e) => setNowData(e.data))
        .catch(() => setError("명언을 불러오지 못했습니다."));
    } else {
      axios
        .get("/")
        .then((e) => setDataList(e.data))
        .catch(() => setError("명언을 불러오지 못했습니다."));
    }
  }, [page]);

  if (page === "main")
    return (
      <>
        {/* styled-system -> 모바일일 때는 red 태블릿일 때는 blue 웹일 때는 yellow */}
        {/* <Box bg={["red", "blue", "yellow"]}>hello</Box>
      <Box display={["none", "initial", "initial"]}>PC</Box>
      <Box display={["initial", "none", "none"]}>Mobile</Box> */}
        <Flex
          position={"fixed"}
          right={["16px", "64px", "64px"]}
          top={["16px", "64px", "64px"]}
        >
          <Flex
            bg={"#2699fb"}
            width={"48px"}
            height={"48px"}
            borderRadius={"4px"}
            justifyContent={"center"}
            alignItems={"center"}
            onClick={() => setPage("edit")}
          >
            <VscListUnordered color="#fff" fontSize={"32px"} />
          </Flex>
        </Flex>
        <Flex
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          height={"100vh"}
          px={"16px"}
        >
          <Box fontSize={"24px"}>오늘의 명언</Box>
          <Flex
            px="16px"
            overflowX={"scroll"}
            mt="64px"
            mb="16px"
            textAlign={"left"}
            border={"solid 1px #707070"}
            width={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            maxWidth={"1000px"}
            height={"160px"}
            fontSize={"48px"}
          >
            {error.length > 0 && error}
            <Box width={"100%"} style={{ whiteSpace: "pre" }}>
              {nowData?.message}
              {"  "}
            </Box>
          </Flex>
          <Box fontSize={"24px"}>{nowData?.author}</Box>
        </Flex>
      </>
    );
  return (
    <Flex
      pt={["8px", "64px", "64px"]}
      pl={["8px", "64px", "64px"]}
      flexDirection={"column"}
    >
      <Flex pb="44px" style={{ gap: "44px" }}>
        <Flex
          bg={"#2699fb"}
          width={"48px"}
          height={"48px"}
          borderRadius={"4px"}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => setPage("main")}
        >
          <VscArrowLeft color="#fff" fontSize={"32px"} />
        </Flex>
        <Flex
          bg={"#2699fb"}
          width={"48px"}
          height={"48px"}
          borderRadius={"4px"}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={() => setCreateMode((prev) => !prev)}
        >
          {createMode ? (
            <VscClose color="#fff" fontSize={"32px"} />
          ) : (
            <VscAdd color="#fff" fontSize={"32px"} />
          )}
        </Flex>
      </Flex>
      {dataList?.map((data, idx) => (
        <Flex
          width={["90%", "416px", "416px"]}
          height="48px"
          mb="16px"
          key={data.message}
        >
          <Flex
            border={"1px solid #707070"}
            flex={"1"}
            overflowX="scroll"
            style={{ whiteSpace: "pre" }}
          >
            {data.message === selectedData ? (
              <>
                <input
                  value={editInp[0]}
                  onChange={(event) =>
                    setEditInp((prev) => [event.target.value, prev[1]])
                  }
                />
                <input
                  value={editInp[1]}
                  onChange={(event) =>
                    setEditInp((prev) => [prev[0], event.target.value])
                  }
                />
              </>
            ) : (
              `[${data.author}] {data.message}`
            )}
            [{data.author}] {data.message}
          </Flex>
          <Flex
            bg={"#2699fb"}
            width={"48px"}
            height={"48px"}
            borderRadius={"4px"}
            justifyContent={"center"}
            alignItems={"center"}
            onClick={() => {
              if (data.message === selectedData) {
                axios
                  .put("/" + idx, {
                    author: editInp[0],
                    message: editInp[1],
                  })
                  .then(({ data }) => {
                    if (data.rs) {
                      setDataList([]);
                      setEditInp(["", ""]);
                      setSelectedData(null);
                      alert("수정 완료!");
                      axios
                        .get("/")
                        .then((e) => setDataList(e.data))
                        .catch(() => setError("명언을 불러오지 못했습니다."));
                    } else {
                      alert("수정 실패!");
                    }
                  });
              } else {
                setSelectedData(data.message);
                setEditInp([data.author, data.message]);
              }
            }}
          >
            {data.message === selectedData ? (
              <VscCheck color="#fff" fontSize={"32px"} />
            ) : (
              <VscEdit color="#fff" fontSize={"32px"} />
            )}
          </Flex>
          <Flex
            bg={"#ff0c00"}
            width={"48px"}
            height={"48px"}
            borderRadius={"4px"}
            justifyContent={"center"}
            alignItems={"center"}
            onClick={() => {
              if (window.confirm("정말 해당 명언을 제거하시겠습니까?")) {
                axios.delete("/" + idx).then(({ data }) => {
                  if (data.rs) {
                    alert("제거 완료!");
                    axios
                      .get("/")
                      .then((e) => setDataList(e.data))
                      .catch(() => setError("명언을 불러오지 못했습니다."));
                  } else {
                    alert("제거 실패!");
                  }
                });
              }
            }}
          >
            <VscTrash color="#fff" fontSize={"32px"} />
          </Flex>
        </Flex>
      ))}
      {createMode && (
        <>
          <Flex width="416px" height="48px" mb="16px">
            <Flex
              border={"1px solid #707070"}
              flex={"1"}
              overflowX="scroll"
              style={{ whiteSpace: "pre" }}
            >
              <input
                value={createInp[0]}
                onChange={(event) =>
                  setCreateInp((prev) => [event.target.value, prev[1]])
                }
              />
              <input
                value={createInp[1]}
                onChange={(event) =>
                  setCreateInp((prev) => [prev[0], event.target.value])
                }
              />
            </Flex>
            <Flex
              bg={"#2699fb"}
              width={"48px"}
              height={"48px"}
              borderRadius={"4px"}
              justifyContent={"center"}
              alignItems={"center"}
              onClick={() => {
                if (createInp[0].length === 0 || createInp[1].length === 0) {
                  alert("정상적인 값이 아닙니다.");
                  return;
                }
                axios
                  .post("/", {
                    author: createInp[0],
                    message: createInp[1],
                  })
                  .then(({ data }) => {
                    if (data.rs) {
                      setDataList([]);
                      setCreateInp(["", ""]);
                      setCreateMode(false);
                      alert("생성 완료!");
                      axios
                        .get("/")
                        .then((e) => setDataList(e.data))
                        .catch(() => setError("명언을 불러오지 못했습니다."));
                    } else {
                      alert("생성 실패!");
                    }
                  });
              }}
            >
              <VscCheck color="#fff" fontSize={"32px"} />
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
}

export default App;
