import { ImageResponse } from "next/og"
import { rarityDict } from "@/constants/rarity_dict"

// https://og-playground.vercel.app/?share=7Vf_a-M2FP9XhMd2G9SOJEu2Fa4bLOwYI_1lHDtYcz_YsZK4dWzPduqU0v99H8lxvl3aHWxwg62USu_pfdf7PNVPzrxMtTN23qbZA2m765mzyPWWmD_uvMxJ5y42eU5W_ZIs3W6VtXrmfD8rCDkoxUlT5ptWQ_CW02r70YjefkUD8S7yP8LKLaP0648zh4zONCuXUevuzBW8rBt3rotW1-Ru02aLxx0FI9bGsRVrAL6FtM7hb7crH3S9yMvOXWVpqgtSl5si1al7a493eVhb2Xo57Alp6jmsrtq2asajUcrpfZnr1WrOHzvfm-flJl3UZdF6hW5H1SbJs_lIUhVEI6VolMhQuqlIpSsoF27kJ6HLmZAJS6hWKvDuKr38YVHW67i9jjdt-c0fmzjP2sfrUH7TZWm7ug4EnTmHcGyOu8L0ZTo-bdrHXF8_PR04hJTJnZ6377J2TGa4Y1Rh5lwdBJ6fh31_H8h_hGJerutRM9yG_e1WW5dxXMTgmizjakwEheFDRS9b-USLHysdq7V62-4uitj9so4fXUXRL6i9m5R5elyGy4UgJM2aKo8fx-RNkpfz-zdHZTA_eVboSR6vTSQnRydREXKjU_RkXceFjgvya5wVSdmRD3XcNPoo-qMyXsrGD06zEUM2a5jfrP_ZfNhr-UzKOmvIL5s8a14K_4w6vc8zgDZHCD2gjNt0MQuSfKNdSUnl-p80AAaAje1S1ayrdbx1O5Sq7yF2aMiTGI7K2Be49_6iu0Mp3jYPS7Jd50WzAz0w33WdB6yX9XLEKaUjiMBSj86ZIwFPstLZctUO1EOmux_LLUhKKOECv-AusjwHqyiLYWgeua3idnXKwu1C-ibylFIhsYsSU8Y8LkD3q_rkmHvghkSaRYnzY8uGspVSN2fSUyY8GUlJfE8wwYIJk54fBJJwL_B9xggLsOHqQIcQ9NUgP-W01w_MEvoTznr90CxhRAY62ukP8mqnb1ZfDfxwYuR4FOz0ot6O9Pe09SNgt5efmjiMvo1L8ImJ0-jbuH3YHWibV2TjtvI27_Avy-N7oal9YBYU91R8atkgrZQ6hW8P4bq817jT-aau0aeTMi8xii-Lfdh1FybrZYEpsD2PK4hYhL0mdldmxUtyw8wfUI7ePsNDFRdnzfo0c97OnGckTsl8faZ_Kj6MjS-L578H1c8aB5-NZ4EgJ-g_yVhk4kVrRpQJYIKTyPydKM_3IwYKHEa9IAiUEQQHmugunwu0MBjCAxh6TRZYVTS-z5CEZQE9AJWRxD0xCs_Ci_ausd_79uHZ3_v1916NDBhGbfBrWTvHEAygNzgFuXNphOATyysoSPJ4fv_SuTtc2Yv975rH7RUAnDb2azeCaSAJU2Z2YtRxTCFDGvSDZJ4Qkf-bmRBfLpcTuf88mv9NrzN6hVKpSDQNdztGTQP1W34D2OAlAmTAi2Q0RT9JHtnnW4RMTTgH6JjRAuLANzSVIV5E37xItv9CBjzLKKJo0dCjoTSIlD711QQPW2jEhcci5cNs4HF8XhAMGemFDE-d-BmzIOIymIReGCo8wgLPKFdSyL1W4CluQGttTtH2PrXzxPqcMC-AdLQPCXSg8E_APmREyCUe0T6lKfgyChBBn_IEfD8IUWXaP7rAFR5j-2j39GmJfv__4bwEtZNvsv1-2PWrc-WUVZuVReOMnxyLAGcMX_TK6RHgjPExeeWkOtksnfEizht95eh1eZe9f6zMp3_bWQqGDEZ_Wic6dcZtvdHPV04bJ5B4H2d5lxUp-VZvK11na9xHnH_nPP8J

export const runtime = "edge"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")
  const scientificName = searchParams.get("scientificName")
  const imageUrl = searchParams.get("imageUrl")
  const maxLength = searchParams.get("maxLength")
  const maxDepth = searchParams.get("maxDepth")
  const minDepth = searchParams.get("minDepth")
  const rarity = searchParams.get("rarity")

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full bg-white">
        <div tw="absolute h-[20px] bg-[#064F83] w-[100%]" />
        <div tw="p-10 flex w-full h-full items-center jutify-center">
          <div tw="flex h-[450px] w-[450px] overflow-hidden rounded-[50px]">
            <img
              src={imageUrl!}
              tw="h-full w-full"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          <div tw="flex flex-col w-[720px] px-12" style={{ gap: 40 }}>
            <div tw="flex flex-col" style={{ gap: 2 }}>
              <div
                tw="text-[50px] text-gray-900 font-bold"
                style={{
                  display: "block",
                  lineClamp: 2,
                }}
              >
                {name}
              </div>
              <div
                tw="text-[36px] text-gray-400 font-medium"
                style={{
                  display: "block",
                  lineClamp: 1,
                }}
              >
                {scientificName}
              </div>
            </div>
            <div tw="flex items-center justify-center rounded-[26px] bg-blue-50 p-3" style={{ gap: 10 }}>
              <div tw="flex max-w-40 flex-1 flex-col items-center font-medium text-[26px]" style={{ gap: 10 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8.9997 8.99994L11.2497 11.2499M8.9997 8.99994L12.4997 5.49994M8.9997 8.99994L5.4997 12.4999M12.4997 5.49994L14.5855 3.41416C15.3665 2.63311 16.6329 2.63311 17.4139 3.41416L20.5855 6.58573C21.3665 7.36678 21.3665 8.63311 20.5855 9.41416L9.41391 20.5857C8.63286 21.3668 7.36653 21.3668 6.58548 20.5857L3.41391 17.4142C2.63286 16.6331 2.63286 15.3668 3.41391 14.5857L5.4997 12.4999M12.4997 5.49994L13.7497 6.74994M5.4997 12.4999L6.7497 13.7499"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  {"<"} {maxLength} cm
                </span>
              </div>

              <div tw="flex max-w-40 flex-1 flex-col items-center font-medium text-[26px]" style={{ gap: 10 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8.9997 8.99994L11.2497 11.2499M8.9997 8.99994L12.4997 5.49994M8.9997 8.99994L5.4997 12.4999M12.4997 5.49994L14.5855 3.41416C15.3665 2.63311 16.6329 2.63311 17.4139 3.41416L20.5855 6.58573C21.3665 7.36678 21.3665 8.63311 20.5855 9.41416L9.41391 20.5857C8.63286 21.3668 7.36653 21.3668 6.58548 20.5857L3.41391 17.4142C2.63286 16.6331 2.63286 15.3668 3.41391 14.5857L5.4997 12.4999M12.4997 5.49994L13.7497 6.74994M5.4997 12.4999L6.7497 13.7499"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>
                  {minDepth ?? 0} - {maxDepth} m
                </span>
              </div>

              {rarity && (
                <div tw="flex max-w-40 flex-1 flex-col items-center font-medium text-[26px]" style={{ gap: 10 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M8.9997 8.99994L11.2497 11.2499M8.9997 8.99994L12.4997 5.49994M8.9997 8.99994L5.4997 12.4999M12.4997 5.49994L14.5855 3.41416C15.3665 2.63311 16.6329 2.63311 17.4139 3.41416L20.5855 6.58573C21.3665 7.36678 21.3665 8.63311 20.5855 9.41416L9.41391 20.5857C8.63286 21.3668 7.36653 21.3668 6.58548 20.5857L3.41391 17.4142C2.63286 16.6331 2.63286 15.3668 3.41391 14.5857L5.4997 12.4999M12.4997 5.49994L13.7497 6.74994M5.4997 12.4999L6.7497 13.7499"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{rarityDict[rarity].name.en}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
