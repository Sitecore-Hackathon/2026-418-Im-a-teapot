{
  description = ".NET 10 and node dev environment, start with 'nix develop'";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgsFor.${system};
        in
        {
          default = pkgs.mkShell {
            name = "dotnet-env";

            packages = with pkgs; [
              dotnet-sdk_10
              nodejs_24
            ];

            DOTNET_ENVIRONMENT = "development";
            DOTNET_ROOT = "${pkgs.dotnet-sdk_10}/share/dotnet";

            shellHook = ''
              printf "\033]0;%s\007" "$(basename "$(pwd)")"
              echo -e "\nWelcome!\n"
              echo "dotnet: $(dotnet --version)"
              echo "node  : $(node --version)"
              echo "npm   : $(npm --version)"
            '';
          };
        }
      );
    };
}
